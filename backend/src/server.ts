import "./config/env"; 
import { createApp } from "./app";
import { prisma } from "./config/prisma";
import { env } from "./config/env";

async function bootstrap(): Promise<void> {
 
  try {
    await prisma.$connect();
    console.log("Banco de dados conectado");
  } catch (err) {
    console.error(" Falha ao conectar ao banco de dados:", err);
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`\n  AdotaPet API rodando`);
    console.log(`   Ambiente : ${env.NODE_ENV}`);
    console.log(`   URL      : http://localhost:${env.PORT}${env.API_PREFIX}`);
    console.log(`   Health   : http://localhost:${env.PORT}${env.API_PREFIX}/health\n`);
  });

 
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n ${signal} recebido. Encerrando servidor...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log(" Servidor encerrado com sucesso.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    console.error("UnhandledRejection:", reason);
    process.exit(1);
  });
}

bootstrap();
