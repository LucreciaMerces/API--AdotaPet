import { Response } from "express";

// Tipagem da estrutura padrão de todas as respostas da API.
// Todos os endpoints devem usar essas funções — nunca res.json() direto —
// para garantir consistência total na API consumida pelo React.
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Operação realizada com sucesso",
  statusCode = 200,
  meta?: Record<string, unknown>
): Response {
  const body: ApiResponse<T> = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message = "Criado com sucesso"
): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  details?: unknown
): Response {
  const body: ApiResponse<null> & { details?: unknown } = {
    success: false,
    message,
    data: null,
  };
  if (details) body.details = details;
  return res.status(statusCode).json(body);
}
