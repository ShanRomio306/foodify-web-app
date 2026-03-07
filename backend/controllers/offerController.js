import mongoose from "mongoose";
import Offer from "../models/Offer.js";

// Restaurant admin: list own offers
export async function getOffersForRestaurant(req, res) {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurantId" });
    }

    const offers = await Offer.find({ restaurantId }).sort({ createdAt: -1 });
    return res.json(offers);
  } catch (err) {
    console.error("getOffersForRestaurant:", err);
    return res.status(500).json({ message: "Failed to fetch offers" });
  }
}

// Create offer for restaurant
export async function createOffer(req, res) {
  try {
    const { restaurantId, title, description, discount, active } = req.body;

    if (!restaurantId || !title || discount == null) {
      return res.status(400).json({ message: "restaurantId, title, discount required" });
    }

    const offer = await Offer.create({
      restaurantId,
      title,
      description,
      discount,
      active: active ?? true,
    });

    return res.status(201).json(offer);
  } catch (err) {
    console.error("createOffer:", err);
    return res.status(500).json({ message: "Failed to create offer" });
  }
}

export async function updateOffer(req, res) {
  try {
    const { id } = req.params;
    const { title, description, discount, active } = req.body;

    const offer = await Offer.findByIdAndUpdate(
      id,
      { title, description, discount, active },
      { new: true }
    );

    if (!offer) return res.status(404).json({ message: "Offer not found" });
    return res.json(offer);
  } catch (err) {
    console.error("updateOffer:", err);
    return res.status(500).json({ message: "Failed to update offer" });
  }
}

export async function deleteOffer(req, res) {
  try {
    const { id } = req.params;
    await Offer.findByIdAndDelete(id);
    return res.json({ message: "Offer deleted" });
  } catch (err) {
    console.error("deleteOffer:", err);
    return res.status(500).json({ message: "Failed to delete offer" });
  }
}