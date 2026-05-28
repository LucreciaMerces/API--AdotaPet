import { beforeAll, afterAll } from "vitest";
import { prisma } from "@config/prisma";

// Setup global executado antes/depois de TODOS os testes.
// Garante que a conexão com o banco seja aberta/fechada corretamente
// e que não haja "open handles" no Vitest.
beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
