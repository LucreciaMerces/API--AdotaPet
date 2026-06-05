import { prisma } from "@config/prisma";
import { AnimalStatus, AdoptionStatus } from "@prisma/client";


export const userRepository = {

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  },

  
  countFavorites(userId: string): Promise<number> {
    return prisma.favorite.count({
      where: { userId },
    });
  },

  
  countAdoptions(userId: string): Promise<number> {
    return prisma.adoption.count({
      where: {
        adopterId: userId,
        status: AdoptionStatus.APPROVED, 
      },
    });
  },

  
  countAvailableAnimals(ngoId: string): Promise<number> {
    return prisma.animal.count({
      where: {
        ngoId,
        status: AnimalStatus.AVAILABLE,
      },
    });
  },

  countAdoptedAnimals(ngoId: string): Promise<number> {
    return prisma.animal.count({
      where: {
        ngoId,
        status: AnimalStatus.ADOPTED,
      },
    });
  },
};
