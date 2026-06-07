import { Router } from "express";
import { adoptionController } from "@controllers/adoptionController";
import { authMiddleware }     from "@middlewares/authMiddleware";

const router = Router();

router.get(   "/my",          authMiddleware, adoptionController.listForAdopter);
router.get(   "/",            authMiddleware, adoptionController.listForNgo);
router.post(  "/",            authMiddleware, adoptionController.create);
router.patch( "/:id/approve", authMiddleware, adoptionController.approve);
router.patch( "/:id/reject",  authMiddleware, adoptionController.reject);
router.patch( "/:id/cancel",  authMiddleware, adoptionController.cancel);

export { router as adoptionRoutes };
