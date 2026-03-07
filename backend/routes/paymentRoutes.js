import express from 'express'
import { getOrderById,createPayment,verifyPayment,paymentStatus,refundPayment,updatePaymentStatus} from '../controllers/paymentController.js'




const router = express.Router();
router.get("/order/:id", getOrderById);
router.post("/payments", createPayment)
router.put("/payments/:id/verify", verifyPayment)
router.get("/payments/:id" ,paymentStatus)
router.post("/payments/:id/refund", refundPayment)
router.patch("/order/:id/payment", updatePaymentStatus);



export default router;
