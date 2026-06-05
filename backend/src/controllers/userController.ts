import { Request, Response, NextFunction } from "express";
import { userService } from "@services/userService";
import { sendSuccess } from "@utils/apiResponse";
import { UnauthorizedError } from "@utils/AppError";



export const userController = {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const profile = await userService.getProfile(req.user.id);

      sendSuccess(res, profile, "Perfil carregado com sucesso");
    } catch (err) {
      next(err);
    }
  },
};
