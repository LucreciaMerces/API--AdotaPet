import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadAnimalImage, uploadAvatar } from "@config/multer";
import { uploadService } from "@services/uploadService";
import { sendCreated, sendSuccess } from "@utils/apiResponse";
import { AppError, UnauthorizedError } from "@utils/AppError";


function handleMulterError(err: unknown, next: NextFunction): boolean {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      next(new AppError(`Arquivo muito grande. Tamanho máximo: ${process.env.MAX_FILE_SIZE_MB ?? 5}MB`, 400));
    } else {
      next(new AppError(`Erro no upload: ${err.message}`, 400));
    }
    return true;
  }
  if (err) {
    next(err);
    return true;
  }
  return false;
}

export const uploadController = {

  uploadAnimalImage(req: Request, res: Response, next: NextFunction): void {
    uploadAnimalImage(req, res, async (err) => {
      if (handleMulterError(err, next)) return;

      try {
        if (!req.user) throw new UnauthorizedError();
        if (!req.file) throw new AppError("Nenhum arquivo enviado", 400);

        const image = await uploadService.uploadAnimalImage(
          req.params.id,
          req.user.id,
          req.file
        );

        sendCreated(res, image, "Imagem enviada com sucesso");
      } catch (error) {
        next(error);
      }
    });
  },


  uploadAvatar(req: Request, res: Response, next: NextFunction): void {
    uploadAvatar(req, res, async (err) => {
      if (handleMulterError(err, next)) return;

      try {
        if (!req.user) throw new UnauthorizedError();
        if (!req.file) throw new AppError("Nenhum arquivo enviado", 400);

        const user = await uploadService.uploadAvatar(req.user.id, req.file);

        sendSuccess(res, user, "Foto de perfil atualizada com sucesso");
      } catch (error) {
        next(error);
      }
    });
  },
};
