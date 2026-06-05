import { Router } from "express";
import { animalController } from "@controllers/animalController";
import { authMiddleware, ngoMiddleware } from "@middlewares/authMiddleware";


const router = Router();

router.get(  "/",    authMiddleware,                    animalController.list);
router.get(  "/:id", authMiddleware,                    animalController.getById);
router.post( "/",    authMiddleware, ngoMiddleware,     animalController.create);
router.put(  "/:id", authMiddleware, ngoMiddleware,     animalController.update);
router.delete("/:id", authMiddleware, ngoMiddleware,    animalController.remove);

export { router as animalRoutes };
