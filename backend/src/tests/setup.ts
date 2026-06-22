import { beforeAll, afterAll } from "vitest";
import { prisma } from "@config/prisma";


beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
