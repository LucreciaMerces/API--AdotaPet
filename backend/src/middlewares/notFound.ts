import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@utils/AppError";


export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(new NotFoundError(`Rota ${req.method} ${req.originalUrl}`));
}
