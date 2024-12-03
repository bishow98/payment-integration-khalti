import express from "express";
import { initializePayment, completePayment,testData } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/initialize-khalti", initializePayment);
router.get("/complete-khalti-payment", completePayment);
router.get("/create-item", testData)
export default router;
