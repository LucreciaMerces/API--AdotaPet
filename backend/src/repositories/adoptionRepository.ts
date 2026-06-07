import { prisma } from "@config/prisma";
import { AdoptionStatus, AnimalStatus } from "@prisma/client";


const adoptionSelect = {
  id:        true,
  status:    true,
  message:   true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
  adopter: {
    select: { id: true, name: true, email: true },
  },
  animal: {
    select: {
      id:    true,
      name:  true,
      ngoId: true,
      status: true,
      ngo: { select: { id: true, name: true } },
      images: {
        where:  { isPrimary: true },
        select: { url: true },
        take:   1,
      },
    },
  },
} as const;

export const adoptionRepository = {

  findById(id: string) {
    return prisma.adoption.findUnique({
      where:  { id },
      select: adoptionSelect,
    });
  },

  findPendingByAdopterAndAnimal(adopterId: string, animalId: string) {
    return prisma.adoption.findFirst({
      where: { adopterId, animalId, status: AdoptionStatus.PENDING },
    });
  },

  create(adopterId: string, animalId: string, message?: string) {
    return prisma.adoption.create({
      data:   { adopterId, animalId, message, status: AdoptionStatus.PENDING },
      select: adoptionSelect,
    });
  },

  async approve(adoptionId: string, animalId: string) {
    const now = new Date();

    return prisma.$transaction([
      prisma.adoption.update({
        where:  { id: adoptionId },
        data:   { status: AdoptionStatus.APPROVED, resolvedAt: now },
        select: adoptionSelect,
      }),
      prisma.animal.update({
        where: { id: animalId },
        data:  { status: AnimalStatus.ADOPTED },
      }),
      prisma.adoption.updateMany({
        where: {
          animalId,
          status: AdoptionStatus.PENDING,
          id: { not: adoptionId },
        },
        data: { status: AdoptionStatus.REJECTED, resolvedAt: now },
      }),
    ]);
  },

  reject(adoptionId: string) {
    return prisma.adoption.update({
      where:  { id: adoptionId },
      data:   { status: AdoptionStatus.REJECTED, resolvedAt: new Date() },
      select: adoptionSelect,
    });
  },

  cancel(adoptionId: string) {
    return prisma.adoption.update({
      where:  { id: adoptionId },
      data:   { status: AdoptionStatus.CANCELLED },
      select: adoptionSelect,
    });
  },

  findAllByNgo(ngoId: string) {
    return prisma.adoption.findMany({
      where:   { animal: { ngoId } },
      orderBy: { createdAt: "desc" },
      select:  adoptionSelect,
    });
  },

  findAllByAdopter(adopterId: string) {
    return prisma.adoption.findMany({
      where:   { adopterId },
      orderBy: { createdAt: "desc" },
      select:  adoptionSelect,
    });
  },
};
