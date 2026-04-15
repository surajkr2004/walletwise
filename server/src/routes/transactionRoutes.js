import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
