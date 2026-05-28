import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Seed placeholder — será populado no Sprint 2 com dados de exemplo:
//   - Usuários (adotantes e ONGs)
//   - Animais
//   - Imagens
async function main(): Promise<void> {
  console.log("🌱  Seed iniciado...");

  // Seeds serão adicionados aqui no Sprint 2

  console.log("✅  Seed concluído.");
}

main()
  .catch((e) => {
    console.error("❌  Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
