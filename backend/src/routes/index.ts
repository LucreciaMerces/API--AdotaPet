import { Router } from "express";
import { prisma } from "@config/prisma";
import { sendSuccess } from "@utils/apiResponse";

const router = Router();

// ──────────────────────────────────────────────────────
//  Health Check
//  GET /api/v1/health
//
//  Verifica se o servidor e o banco de dados estão online.
//  Útil para probes de Kubernetes, Railway, Render, etc.
// ──────────────────────────────────────────────────────
router.get("/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    sendSuccess(res, {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch {
    next(new Error("Database connection failed"));
  }
});

// ──────────────────────────────────────────────────────
//  Registro das rotas por módulo
//  Cada sprint adicionará sua própria linha aqui.
//
//  Exemplo (Sprint 3):
//    import { authRoutes } from './authRoutes';
//    router.use('/auth', authRoutes);
//
//  Exemplo (Sprint 5):
//    import { animalRoutes } from './animalRoutes';
//    router.use('/animals', animalRoutes);
// ──────────────────────────────────────────────────────

export { router as apiRoutes };
