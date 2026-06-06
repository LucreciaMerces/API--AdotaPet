import path from "path";
import fs from "fs";
import { animalRepository } from "@repositories/animalRepository";
import { uploadRepository }  from "@repositories/uploadRepository";
import { NotFoundError, ForbiddenError, AppError } from "@utils/AppError";
import { env } from "@config/env";


function buildPublicUrl(subdir: "animals" | "avatars", filename: string): string {
  const port   = env.PORT;
  const host   = `http://localhost:${port}`;
  return `${host}/uploads/${subdir}/${filename}`;
}

export const uploadService = {

  async uploadAnimalImage(
    animalId:    string,
    requesterId: string,
    file:        Express.Multer.File
  ) {
    const animal = await animalRepository.findById(animalId);

    if (!animal) {
      fs.unlinkSync(file.path);
      throw new NotFoundError("Animal");
    }

    if (animal.ngoId !== requesterId) {
      fs.unlinkSync(file.path);
      throw new ForbiddenError("Você não tem permissão para enviar imagens para este animal");
    }

    const total     = await uploadRepository.countAnimalImages(animalId);
    const isPrimary = total === 0;

    const filename = path.basename(file.path);
    const url      = buildPublicUrl("animals", filename);

    const image = await uploadRepository.createImage({
      url,
      key:      filename,
      isPrimary,
      animalId,
    });

    return image;
  },

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new AppError("Nenhum arquivo enviado", 400);
    }

    const filename  = path.basename(file.path);
    const avatarUrl = buildPublicUrl("avatars", filename);

    const user = await uploadRepository.updateAvatar(userId, avatarUrl);

    return user;
  },
};
