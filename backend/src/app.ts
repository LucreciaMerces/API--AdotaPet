import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import { corsOptions } from "@config/cors";
import { requestLogger } from "@middlewares/requestLogger";
import { notFoundHandler } from "@middlewares/notFound";
import { errorHandler } from "@middlewares/errorHandler";
import { apiRoutes } from "@routes/index";
import { env } from "@config/env";

// Fábrica da aplicação Express, separada de server.ts.
// Isso permite importar `app` nos testes sem subir um servidor TCP —
// padrão recomendado para testes de integração com supertest.
export function createApp(): Express {
  const app = express();

  // ── Segurança ──────────────────────────────────────────────────────────
  // Helmet define cabeçalhos HTTP de segurança:
  //   X-Content-Type-Options, X-Frame-Options, Content-Security-Policy…
  app.use(helmet());

  // CORS configurado via corsOptions (origens vindas do .env)
  app.use(cors(corsOptions));

  // ── Parsing ────────────────────────────────────────────────────────────
  // Habilita leitura de JSON no corpo das requisições (req.body)
  app.use(express.json({ limit: "10mb" }));

  // Habilita leitura de form-urlencoded (necessário para alguns clientes)
  app.use(express.urlencoded({ extended: true }));

  // ── Logging ────────────────────────────────────────────────────────────
  app.use(requestLogger);

  // ── Rotas ──────────────────────────────────────────────────────────────
  app.use(env.API_PREFIX, apiRoutes);

  // ── Tratamento de erros ────────────────────────────────────────────────
  // Ordem importa: notFound → errorHandler (sempre por último)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
