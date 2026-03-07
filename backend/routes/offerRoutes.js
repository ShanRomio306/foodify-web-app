import express from "express";
import {
  getOffersForRestaurant,
  createOffer,
  updateOffer,
  deleteOffer,
} from "../controllers/offerController.js";

const router = express.Router();

// Public/restaurant: get offers for a restaurant
router.get("/offers/restaurant/:restaurantId", getOffersForRestaurant);

// Admin CRUD
router.post("/offers", createOffer);
router.patch("/offers/:id", updateOffer);
router.delete("/offers/:id", deleteOffer);

export default router;