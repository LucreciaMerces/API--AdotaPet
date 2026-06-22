import { describe, it, expect, vi, beforeEach } from "vitest";

import { authService } from "../services/authService";
import { authRepository } from "@repositories/authRepository";
import bcrypt from "bcryptjs"; 

vi.mock("@repositories/authRepository", () => {
  const mockMethods = {
    findByEmail: vi.fn(),
    create: vi.fn(),
  };
  return {
    authRepository: mockMethods
  };
});

vi.mock("bcryptjs", () => {
  const mockBcrypt = {
    compare: vi.fn(),
    hash: vi.fn(),
  };
  return {
    ...mockBcrypt,
    default: mockBcrypt
  };
});

describe("authService.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar usuário e retornar token quando e-mail é Crypto novo", async () => {
    const repositoryMock = authRepository as any;
    const bcryptMock = bcrypt as any;

    repositoryMock.findByEmail.mockResolvedValue(null);
    repositoryMock.create.mockResolvedValue({
      id: "user-id-1",
      name: "João Silva",
      email: "joao@email.com",
      password: "hashed_password",
      role: "NGO",
    });

    bcryptMock.hash.mockResolvedValue("hashed_password");
    if (bcryptMock.default?.hash) bcryptMock.default.hash.mockResolvedValue("hashed_password");

    const result = await authService.register({
      name: "João Silva",
      email: "joao@email.com",
      password: "password123",
    });

    expect(result).toHaveProperty("token");
    expect(result.user.email).toBe("joao@email.com");
  });

  it("deve lançar ConflictError quando e-mail já existe", async () => {
    const repositoryMock = authRepository as any;
    
    repositoryMock.findByEmail.mockResolvedValue({
      id: "user-id",
      email: "existe@email.com",
      password: "hashed_password",
    });

    const promise = authService.register({
      name: "Outro",
      email: "existe@email.com",
      password: "password123",
    });

    await expect(promise).rejects.toMatchObject({
      name: "ConflictError",
      statusCode: 409,
    });
  });
});

describe("authService.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar token quando credenciais estão corretas", async () => {
    const repositoryMock = authRepository as any;
    const bcryptMock = bcrypt as any;

    repositoryMock.findByEmail.mockResolvedValue({
      id: "user-id-1",
      name: "João Silva",
      email: "joao@email.com",
      password: "hashed_password",
      role: "NGO",
    });

    bcryptMock.compare.mockResolvedValue(true);
    if (bcryptMock.default?.compare) {
      bcryptMock.default.compare.mockResolvedValue(true);
    }

    const result = await authService.login({
      email: "joao@email.com",
      password: "password123",
    });

    expect(result).toHaveProperty("token");
  });

  it("deve lançar UnauthorizedError quando e-mail não existe", async () => {
    const repositoryMock = authRepository as any;
    repositoryMock.findByEmail.mockResolvedValue(null);

    const promise = authService.login({ 
      email: "naoexiste@email.com", 
      password: "123" 
    });

    await expect(promise).rejects.toMatchObject({
      name: "UnauthorizedError",
      statusCode: 401,
    });
  });

  it("deve lançar UnauthorizedError quando senha está errada", async () => {
    const repositoryMock = authRepository as any;
    const bcryptMock = bcrypt as any;

    repositoryMock.findByEmail.mockResolvedValue({
      id: "user-id",
      email: "joao@email.com",
      password: "hashed_password",
    });

    bcryptMock.compare.mockResolvedValue(false);
    if (bcryptMock.default?.compare) {
      bcryptMock.default.compare.mockResolvedValue(false);
    }

    const promise = authService.login({ 
      email: "joao@email.com", 
      password: "senhaErrada" 
    });

    await expect(promise).rejects.toMatchObject({
      name: "UnauthorizedError",
      statusCode: 401,
    });
  });
});

describe("authService.verifyToken", () => {
  it("deve lançar UnauthorizedError para token inválido", () => {
    let error: any;
    
    try {
      authService.verifyToken("token.invalido.xyz");
    } catch (err) {
      error = err;
    }

    expect(error).toMatchObject({
      name: "UnauthorizedError",
      statusCode: 401,
    });
  });
});