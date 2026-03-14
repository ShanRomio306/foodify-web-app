import express from "express";
import {
  getRestaurantById,
  getRestaurantByEmail,
  getAllRestaurants,
  updateRestaurant,
  deleteRest,
  openRestaurant,
  closeRestaurant,
  updateRestaurantTimings,
  approveRestaurant,
  addRest,
} from "../controllers/restController.js";

const router = express.Router();

router.get("/rests", getAllRestaurants);
router.get("/rests/:id", getRestaurantById);
router.get("/rests/email/:email", getRestaurantByEmail);
router.put("/rests/:id", updateRestaurant);
router.delete("/rests/:id", deleteRest);
router.post("/rests",addRest);
router.put("/rests/:id/open", openRestaurant);
router.put("/rests/:id/close", closeRestaurant);
router.put("/rests/:id/timings", updateRestaurantTimings);
router.put("/rests/:id/approve", approveRestaurant);

export default router;