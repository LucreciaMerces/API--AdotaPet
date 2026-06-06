import { Router } from "express";
import { prisma } from "@config/prisma";
import { sendSuccess } from "@utils/apiResponse";
import { authRoutes }   from "./authRoutes";
import { userRoutes }   from "./userRoutes";
import { animalRoutes } from "./animalRoutes";
import { favoriteRoutes } from "./favoriteRoutes";


const router = Router();


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


router.use("/auth",    authRoutes);    
router.use("/users",   userRoutes);    
router.use("/animals", animalRoutes); 
router.use("/favorites", favoriteRoutes); 



export { router as apiRoutes };
