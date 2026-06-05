import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "@services/authService";
import { authRepository } from "@repositories/authRepository";
import { ConflictError, UnauthorizedError } from "@utils/AppError";

vi.mock("@repositories/authRepository", () => ({
  authRepository: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("$hashed$password"),
    compare: vi.fn(),
  },
}));

const mockUser = {
  id: "user-id-1",
  name: "João Silva",
  email: "joao@email.com",
  role: "ADOPTER" as const,
  phone: null,
  city: null,
  state: null,
  bio: null,
  avatarUrl: null,
  createdAt: new Date(),
};

describe("authService.register", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deve criar usuário e retornar token quando e-mail é novo", async () => {
    vi.mocked(authRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(authRepository.create).mockResolvedValue(mockUser);

    const result = await authService.register({
      name: "João Silva",
      email: "joao@email.com",
      password: "Senha@123",
      role: "ADOPTER",
    });

    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("joao@email.com");
    expect(authRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ password: "$hashed$password" })
    );
  });

  it("deve lançar ConflictError quando e-mail já existe", async () => {
    vi.mocked(authRepository.findByEmail).mockResolvedValue({
      ...mockUser,
      password: "$hashed$",
    });

    await expect(
      authService.register({
        name: "Outro",
        email: "joao@email.com",
        password: "Senha@123",
        role: "ADOPTER",
      })
    ).rejects.toThrow(ConflictError);
  });
});

describe("authService.login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deve retornar token quando credenciais estão corretas", async () => {
    vi.mocked(authRepository.findByEmail).mockResolvedValue({
      ...mockUser,
      password: "$hashed$password",
    });

    const bcrypt = await import("bcryptjs");
    vi.mocked(bcrypt.default.compare).mockResolvedValue(true as never);

    const result = await authService.login({
      email: "joao@email.com",
      password: "Senha@123",
    });

    expect(result.token).toBeDefined();
    expect(result.user).not.toHaveProperty("password");
  });

  it("deve lançar UnauthorizedError quando e-mail não existe", async () => {
    vi.mocked(authRepository.findByEmail).mockResolvedValue(null);

    await expect(
      authService.login({ email: "naoexiste@email.com", password: "123" })
    ).rejects.toThrow(UnauthorizedError);
  });

  it("deve lançar UnauthorizedError quando senha está errada", async () => {
    vi.mocked(authRepository.findByEmail).mockResolvedValue({
      ...mockUser,
      password: "$hashed$password",
    });

    const bcrypt = await import("bcryptjs");
    vi.mocked(bcrypt.default.compare).mockResolvedValue(false as never);

    await expect(
      authService.login({ email: "joao@email.com", password: "senhaErrada" })
    ).rejects.toThrow(UnauthorizedError);
  });
});

describe("authService.verifyToken", () => {
  it("deve lançar UnauthorizedError para token inválido", () => {
    expect(() => authService.verifyToken("token.invalido.xyz")).toThrow(
      UnauthorizedError
    );
  });
});
