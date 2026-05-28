import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "@utils/AppError";
import { sendError } from "@utils/apiResponse";
import { env } from "@config/env";

// Handler global de erros. Deve ser registrado DEPOIS de todas as rotas
// no Express (último middleware com 4 parâmetros).
//
// Trata 3 categorias:
//   1. AppError          → erros operacionais que criamos intencionalmente
//   2. ZodError          → falhas de validação de schema
//   3. Prisma errors     → erros do banco de dados (unique constraint, etc.)
//   4. Erros genéricos   → qualquer coisa inesperada vira 500
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // 1. Erros operacionais da aplicação
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // 2. Erros de validação Zod — formata os campos com problema
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    sendError(res, "Dados inválidos", 422, details);
    return;
  }

  // 3. Erros do Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = unique constraint violation
    if (err.code === "P2002") {
      const field = (err.meta?.target as string[])?.join(", ") ?? "campo";
      sendError(res, `Já existe um registro com esse ${field}`, 409);
      return;
    }
    // P2025 = registro não encontrado em operação de update/delete
    if (err.code === "P2025") {
      sendError(res, "Registro não encontrado", 404);
      return;
    }
    sendError(res, "Erro no banco de dados", 500);
    return;
  }

  // 4. Erro desconhecido — nunca expor stack em produção
  const message =
    env.NODE_ENV === "production" ? "Erro interno do servidor" : String(err);

  console.error("❌ Erro não tratado:", err);
  sendError(res, message, 500);
}
