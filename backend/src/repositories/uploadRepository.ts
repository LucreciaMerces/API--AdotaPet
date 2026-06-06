import { prisma } from "@config/prisma";


export interface CreateImageData {
  url:       string;
  key:       string;
  isPrimary: boolean;
  animalId:  string;
}

export const uploadRepository = {

  countAnimalImages(animalId: string): Promise<number> {
    return prisma.image.count({ where: { animalId } });
  },

  createImage(data: CreateImageData) {
    return prisma.image.create({ data });
  },

  updateAvatar(userId: string, avatarUrl: string) {
    return prisma.user.update({
      where:  { id: userId },
      data:   { avatarUrl },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true },
    });
  },
};
