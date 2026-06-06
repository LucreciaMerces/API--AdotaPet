import { prisma } from "@config/prisma";


export const favoriteRepository = {

  findByUserAndAnimal(userId: string, animalId: string) {
    return prisma.favorite.findUnique({
      where: { userId_animalId: { userId, animalId } },
    });
  },

  create(userId: string, animalId: string) {
    return prisma.favorite.create({
      data: { userId, animalId },
      select: {
        id:        true,
        createdAt: true,
        animal: {
          select: {
            id:      true,
            name:    true,
            species: true,
            breed:   true,
            status:  true,
            images: {
              where:   { isPrimary: true },
              select:  { id: true, url: true, isPrimary: true },
              take:    1,
            },
          },
        },
      },
    });
  },

  delete(userId: string, animalId: string) {
    return prisma.favorite.delete({
      where: { userId_animalId: { userId, animalId } },
    });
  },

  findAllByUser(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id:        true,
        createdAt: true,
        animal: {
          select: {
            id:      true,
            name:    true,
            species: true,
            breed:   true,
            status:  true,
            images: {
              where:  { isPrimary: true },
              select: { id: true, url: true, isPrimary: true },
              take:   1,
            },
          },
        },
      },
    });
  },
};
