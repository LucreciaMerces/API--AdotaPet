
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; 
    this.name = "AppError";

    
    Object.setPrototypeOf(this, AppError.prototype);
  }
}


export class NotFoundError extends AppError {
  constructor(resource = "Recurso") {
    super(`${resource} não encontrado`, 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso negado") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflito de dados") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Dados inválidos") {
    super(message, 422);
    this.name = "ValidationError";
  }
}
