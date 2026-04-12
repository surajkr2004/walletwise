import { Router } from "express";
import { getWallet, updateSavings } from "../controllers/walletController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getWallet);
router.put("/savings", updateSavings);

export default router;
