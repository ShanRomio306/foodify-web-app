import express from "express"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js"

import { getRestaurantDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router()

router.get("/rests/:id/dashboard-stats", getRestaurantDashboardStats);
router.get("/", getCategories)
router.post("/", createCategory)
router.patch("/:id", updateCategory)
router.delete("/:id", deleteCategory)

export default router