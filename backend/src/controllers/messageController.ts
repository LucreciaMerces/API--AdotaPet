import { Request, Response, NextFunction } from "express";
import { messageService }    from "@services/messageService";
import { sendCreated, sendSuccess } from "@utils/apiResponse";
import { UnauthorizedError } from "@utils/AppError";
import { sendMessageSchema } from "@validations/messageValidation";

export const messageController = {


  async send(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const { body } = sendMessageSchema.parse({ body: req.body });
      const message  = await messageService.sendMessage(req.user.id, body);

      sendCreated(res, message, "Mensagem enviada");
    } catch (err) {
      next(err);
    }
  },

  
  async getByAdoption(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const messages = await messageService.getMessages(
        req.params.adoptionId,
        req.user.id
      );

      sendSuccess(res, messages, "Mensagens carregadas com sucesso");
    } catch (err) {
      next(err);
    }
  },

  
  async myConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const conversations = await messageService.getConversationsForAdopter(
        req.user.id,
        req.user.role
      );

      sendSuccess(res, conversations, "Conversas carregadas com sucesso");
    } catch (err) {
      next(err);
    }
  },

 
  async ngoConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();

      const conversations = await messageService.getConversationsForNgo(
        req.user.id,
        req.user.role
      );

      sendSuccess(res, conversations, "Conversas carregadas com sucesso");
    } catch (err) {
      next(err);
    }
  },
};
