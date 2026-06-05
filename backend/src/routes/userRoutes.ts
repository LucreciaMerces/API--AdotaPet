import { Router } from "express";
import { userController } from "@controllers/userController";
import { authMiddleware } from "@middlewares/authMiddleware";

const router = Router();

router.get("/me", authMiddleware, userController.getMe);

export { router as userRoutes };