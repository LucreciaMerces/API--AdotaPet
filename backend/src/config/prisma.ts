import { PrismaClient } from "@prisma/client";
import { env } from "@config/env";

// Singleton pattern: evita múltiplas instâncias do Prisma Client no mesmo
// processo, o que esgotaria as conexões do pool do PostgreSQL.
//
// Em desenvolvimento o hot-reload do tsx recria módulos; sem o padrão de
// singleton no globalThis, cada reload abriria um novo pool de conexões.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
