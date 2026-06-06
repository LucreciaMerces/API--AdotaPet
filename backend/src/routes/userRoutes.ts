import { Router } from "express";
import { userController } from "@controllers/userController";
import { uploadController } from "@controllers/uploadController";
import { authMiddleware } from "@middlewares/authMiddleware";

const router = Router();

router.get("/me", authMiddleware, userController.getMe);
router.post("/avatar", authMiddleware, uploadController.uploadAvatar);


export { router as userRoutes };