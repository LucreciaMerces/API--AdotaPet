import { Request, Response, NextFunction } from "express";
import { adoptionService }   from "@services/adoptionService";
import { sendCreated, sendSuccess } from "@utils/apiResponse";
import { UnauthorizedError } from "@utils/AppError";

export const adoptionController = {

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const { animalId, message } = req.body as { animalId: string; message?: string };

      const adoption = await adoptionService.createAdoption(
        req.user.id,
        req.user.role,
        animalId,
        message
      );

      sendCreated(res, adoption, "Solicitação de adoção enviada com sucesso");
    } catch (err) {
      next(err);
    }
  },

  async approve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const adoption = await adoptionService.approveAdoption(
        req.params.id,
        req.user.id,
        req.user.role
      );

      sendSuccess(res, adoption, "Adoção aprovada com sucesso");
    } catch (err) {
      next(err);
    }
  },

  async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const adoption = await adoptionService.rejectAdoption(
        req.params.id,
        req.user.id,
        req.user.role
      );

      sendSuccess(res, adoption, "Solicitação rejeitada");
    } catch (err) {
      next(err);
    }
  },

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const adoption = await adoptionService.cancelAdoption(
        req.params.id,
        req.user.id,
        req.user.role
      );

      sendSuccess(res, adoption, "Solicitação cancelada");
    } catch (err) {
      next(err);
    }
  },

  async listForNgo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const adoptions = await adoptionService.listForNgo(req.user.id, req.user.role);

      sendSuccess(res, adoptions, "Solicitações listadas com sucesso");
    } catch (err) {
      next(err);
    }
  },

  async listForAdopter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const adoptions = await adoptionService.listForAdopter(req.user.id, req.user.role);

      sendSuccess(res, adoptions, "Histórico de adoções carregado com sucesso");
    } catch (err) {
      next(err);
    }
  },
};
