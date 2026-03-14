import express from "express";
import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemById,
  getMenuByRestaurant,
  updateMenuItemPrice,
  updateMenuItemStock,
} from "../controllers/menuController.js";
import mongoose from "mongoose";
import { getRestaurantDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.post("/rests/:id/menu", addMenuItem);
router.patch("/rests/:id/menu/:mid", updateMenuItem);
router.delete("/rests/:id/menu/:mid", deleteMenuItem);
router.get("/rests/:id/menu/:mid", getMenuItemById);
router.get("/rests/:id/menu", getMenuByRestaurant);
router.get("/rests/:id/dashboard-stats", getRestaurantDashboardStats);
router.put("/menu/:id/price", updateMenuItemPrice);
router.put("/menu/:id/stock", updateMenuItemStock);

export default router;