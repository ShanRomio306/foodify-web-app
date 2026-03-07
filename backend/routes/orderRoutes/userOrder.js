import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
} from "../../controllers/orderController.js";

const router = express.Router();


router.post("/order", placeOrder);
router.get("/order/user/:userId", getMyOrders);
router.get("/order/:id", getOrderById);
router.delete("/order/:id", cancelOrder);
router.get("/orders", getAllOrders);

export default router;