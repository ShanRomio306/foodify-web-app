import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  getOrdersByRestaurant,
  updateOrderStatus,
} from "../../controllers/orderController.js";

const router = express.Router();

router.post("/order", placeOrder);
router.get("/order/user/:userId", getMyOrders);
router.get("/order/:id", getOrderById);
router.delete("/order/:id", cancelOrder);
router.put("/order/:id/status", updateOrderStatus);

router.get("/orders", getAllOrders);
router.get("/orders/restaurant/:restaurantId", getOrdersByRestaurant);

export default router;