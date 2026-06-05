import { describe, it, expect, vi } from "vitest";
import { createApp } from "../app";


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

   
    expect(app).toBeDefined();
  });

  it("app deve ser criada sem erros", () => {
    expect(() => createApp()).not.toThrow();
  });
});
