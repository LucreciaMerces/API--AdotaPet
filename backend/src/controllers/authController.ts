import { Request, Response, NextFunction } from "express";
import { authService } from "@services/authService";
import { registerSchema, loginSchema } from "@validations/authValidation";
import { sendCreated, sendSuccess } from "@utils/apiResponse";


export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { body } = registerSchema.parse({ body: req.body });
      const result = await authService.register(body);

      sendCreated(res, result, "Conta criada com sucesso");
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { body } = loginSchema.parse({ body: req.body });
      const result = await authService.login(body);

      sendSuccess(res, result, "Login realizado com sucesso");
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      sendSuccess(res, req.user, "Dados do usuário autenticado");
    } catch (err) {
      next(err);
    }
  },
};
