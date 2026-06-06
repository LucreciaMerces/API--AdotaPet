import { Request, Response, NextFunction } from "express";
import { favoriteService }   from "@services/favoriteService";
import { sendCreated, sendNoContent, sendSuccess } from "@utils/apiResponse";
import { UnauthorizedError } from "@utils/AppError";

export const favoriteController = {

  async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const favorite = await favoriteService.addFavorite(
        req.user.id,
        req.user.role,
        req.params.animalId
      );

      sendCreated(res, favorite, "Animal adicionado aos favoritos");
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      await favoriteService.removeFavorite(
        req.user.id,
        req.user.role,
        req.params.animalId
      );

      sendNoContent(res);
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const favorites = await favoriteService.listFavorites(
        req.user.id,
        req.user.role
      );

      sendSuccess(res, favorites, "Favoritos listados com sucesso");
    } catch (err) {
      next(err);
    }
  },
};
