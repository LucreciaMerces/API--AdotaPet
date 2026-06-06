import { Router } from "express";
import { favoriteController } from "@controllers/favoriteController";
import { authMiddleware }     from "@middlewares/authMiddleware";



const router = Router();

router.get(   "/",          authMiddleware, favoriteController.list);
router.post(  "/:animalId", authMiddleware, favoriteController.add);
router.delete("/:animalId", authMiddleware, favoriteController.remove);

export { router as favoriteRoutes };
