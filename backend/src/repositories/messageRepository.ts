import { prisma } from "@config/prisma";

export const messageRepository = {

  findAdoptionById(adoptionId: string) {
    return prisma.adoption.findUnique({
      where:  { id: adoptionId },
      select: {
        id:        true,
        adopterId: true,
        animal: {
          select: { ngoId: true },
        },
      },
    });
  },

  create(senderId: string, adoptionId: string, content: string) {
    return prisma.message.create({
      data:   { senderId, adoptionId, content },
      select: {
        id:        true,
        content:   true,
        createdAt: true,
        sender: { select: { id: true, name: true } },
      },
    });
  },

  findByAdoption(adoptionId: string) {
    return prisma.message.findMany({
      where:   { adoptionId },
      orderBy: { createdAt: "asc" },
      select: {
        id:        true,
        content:   true,
        createdAt: true,
        sender: { select: { id: true, name: true } },
      },
    });
  },

  findConversationsForAdopter(adopterId: string) {
    return prisma.adoption.findMany({
      where:   { adopterId },
      orderBy: { updatedAt: "desc" },
      select: {
        id:     true,
        status: true,
        animal: {
          select: {
            id:   true,
            name: true,
            ngo:  { select: { id: true, name: true } },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take:    1,
          select:  { content: true, createdAt: true },
        },
      },
    });
  },

  findConversationsForNgo(ngoId: string) {
    return prisma.adoption.findMany({
      where:   { animal: { ngoId } },
      orderBy: { updatedAt: "desc" },
      select: {
        id:     true,
        status: true,
        adopter: { select: { id: true, name: true } },
        animal: {
          select: { id: true, name: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take:    1,
          select:  { content: true, createdAt: true },
        },
      },
    });
  },
};
