import { Router } from "express";
import { messageController } from "@controllers/messageController";
import { authMiddleware }    from "@middlewares/authMiddleware";


const router = Router();

router.get( "/my",                   authMiddleware, messageController.myConversations);
router.get( "/adoption/:adoptionId", authMiddleware, messageController.getByAdoption);
router.get( "/",                     authMiddleware, messageController.ngoConversations);
router.post("/",                     authMiddleware, messageController.send);

export { router as messageRoutes };
