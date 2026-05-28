import "./config/env"; // Valida variáveis de ambiente antes de qualquer coisa
import { createApp } from "./app";
import { prisma } from "./config/prisma";
import { env } from "./config/env";

async function bootstrap(): Promise<void> {
  // Testa a conexão com o banco antes de abrir o servidor.
  // Falha rápida: melhor o processo morrer aqui do que receber
  // requisições e retornar 500 por problema de banco.
  try {
    await prisma.$connect();
    console.log("✅  Banco de dados conectado");
  } catch (err) {
    console.error("❌  Falha ao conectar ao banco de dados:", err);
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`\n🐾  AdotaPet API rodando`);
    console.log(`   Ambiente : ${env.NODE_ENV}`);
    console.log(`   URL      : http://localhost:${env.PORT}${env.API_PREFIX}`);
    console.log(`   Health   : http://localhost:${env.PORT}${env.API_PREFIX}/health\n`);
  });

  // Graceful shutdown: fecha conexões abertas antes de encerrar.
  // Importante para deploys sem downtime (ex: Railway, Docker).
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n⚠️  ${signal} recebido. Encerrando servidor...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log("👋  Servidor encerrado com sucesso.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Captura rejeições de promises não tratadas para evitar crashes silenciosos
  process.on("unhandledRejection", (reason) => {
    console.error("❌  UnhandledRejection:", reason);
    process.exit(1);
  });
}

bootstrap();
