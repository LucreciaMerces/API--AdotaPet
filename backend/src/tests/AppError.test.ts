import { describe, it, expect } from "vitest";
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ValidationError,
} from "@utils/AppError";

describe("AppError", () => {
  it("deve criar um erro com mensagem e status code corretos", () => {
    const err = new AppError("algo deu errado", 400);
    expect(err.message).toBe("algo deu errado");
    expect(err.statusCode).toBe(400);
    expect(err.isOperational).toBe(true);
  });

  it("deve usar status 400 como padrão", () => {
    const err = new AppError("erro genérico");
    expect(err.statusCode).toBe(400);
  });

  it("instanceof deve funcionar corretamente", () => {
    const err = new AppError("teste");
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(Error);
  });
});

describe("Erros específicos", () => {
  it("NotFoundError deve ter status 404", () => {
    const err = new NotFoundError("Animal");
    expect(err.statusCode).toBe(404);
    expect(err.message).toContain("Animal");
  });

  it("UnauthorizedError deve ter status 401", () => {
    expect(new UnauthorizedError().statusCode).toBe(401);
  });

  it("ForbiddenError deve ter status 403", () => {
    expect(new ForbiddenError().statusCode).toBe(403);
  });

  it("ConflictError deve ter status 409", () => {
    expect(new ConflictError().statusCode).toBe(409);
  });

  it("ValidationError deve ter status 422", () => {
    expect(new ValidationError().statusCode).toBe(422);
  });
});
