import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "@utils/AppError";
import { sendError } from "@utils/apiResponse";
import { env } from "@config/env";


export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    sendError(res, "Dados inválidos", 422, details);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = (err.meta?.target as string[])?.join(", ") ?? "campo";
      sendError(res, `Já existe um registro com esse ${field}`, 409);
      return;
    }
    if (err.code === "P2025") {
      sendError(res, "Registro não encontrado", 404);
      return;
    }
    sendError(res, "Erro no banco de dados", 500);
    return;
  }

  const message =
    env.NODE_ENV === "production" ? "Erro interno do servidor" : String(err);

  console.error(" Erro não tratado:", err);
  sendError(res, message, 500);
}
