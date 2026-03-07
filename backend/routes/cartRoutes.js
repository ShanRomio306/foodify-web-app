import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
  updateCartItemQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/cart/:userId", getCart);
router.post("/cart", addToCart);


router.delete("/cart/:userId/item/:productId", removeFromCart);
router.patch("/cart/:userId/item/:productId", updateCartItemQuantity);
router.delete("/cart/:userId", clearCart);

export default router;