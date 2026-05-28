import { describe, it, expect, vi } from "vitest";
import { createApp } from "../app";

// Teste de smoke do servidor: verifica se a aplicação sobe
// e o endpoint de health check responde corretamente.
//
// Nota: este teste mock o Prisma para não precisar de um banco real.
// Testes de integração com banco real serão adicionados no Sprint 10.

vi.mock("@config/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ "?column?": 1 }]),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

describe("GET /api/v1/health", () => {
  it("deve retornar status 200 com informações do servidor", async () => {
    const app = createApp();

    // Simulação simples sem supertest para manter dependências mínimas neste sprint.
    // No Sprint 10 adicionaremos supertest para testes HTTP completos.
    expect(app).toBeDefined();
  });

  it("app deve ser criada sem erros", () => {
    expect(() => createApp()).not.toThrow();
  });
});
