import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@utils/AppError";

// Captura qualquer rota que não foi matchada pelas rotas registradas.
// Deve ser registrado ANTES do errorHandler e DEPOIS de todas as rotas.
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(new NotFoundError(`Rota ${req.method} ${req.originalUrl}`));
}
