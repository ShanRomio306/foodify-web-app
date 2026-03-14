import mongoose from "mongoose";
import Menu from "../models/Menu.js";
import Rest from "../models/Restaurant.js";

export async function addMenuItem(req, res) {
  try {
    const restaurantId = req.params.id;
    const {
      name,
      category,
      price,
      quantity_available,
      image,
      description,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant id" });
    }

    if (!name || !category || price == null || quantity_available == null) {
      return res.status(400).json({
        message: "name, category, price and quantity_available are required",
      });
    }

    const restaurant = await Rest.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menu = await Menu.create({
      restaurantId,
      name,
      category,
      price: Number(price),
      quantity_available: Number(quantity_available),
      image: image || "",
      description: description || "",
    });

    res.status(201).json(menu);
  } catch (error) {
    console.error("addMenuItem error:", error);
    res.status(500).json({
      message: "Failed to add menu item",
      error: error.message,
    });
  }
}

export async function updateMenuItem(req, res) {
  try {
    const { id, mid } = req.params;

    const menu = await Menu.findOneAndUpdate(
      { _id: mid, restaurantId: id },
      req.body,
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(menu);
  } catch (error) {
    console.error("updateMenuItem error:", error);
    res.status(500).json({ message: "Failed to update menu item" });
  }
}

export async function deleteMenuItem(req, res) {
  try {
    const { id, mid } = req.params;

    const menu = await Menu.findOneAndDelete({
      _id: mid,
      restaurantId: id,
    });

    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    console.error("deleteMenuItem error:", error);
    res.status(500).json({ message: "Failed to delete menu item" });
  }
}

export async function getMenuItemById(req, res) {
  try {
    const { id, mid } = req.params;

    const menu = await Menu.findOne({
      _id: mid,
      restaurantId: id,
    });

    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(menu);
  } catch (error) {
    console.error("getMenuItemById error:", error);
    res.status(500).json({ message: "Failed to fetch menu item" });
  }
}

export async function getMenuByRestaurant(req, res) {
  try {
    const { id } = req.params;

    const menu = await Menu.find({ restaurantId: id }).sort({ createdAt: -1 });
    res.json(menu);
  } catch (error) {
    console.error("getMenuByRestaurant error:", error);
    res.status(500).json({ message: "Failed to fetch restaurant menu" });
  }
}

export async function updateMenuItemPrice(req, res) {
  try {
    const { price } = req.body;

    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { price },
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(menu);
  } catch (error) {
    console.error("updateMenuItemPrice error:", error);
    res.status(500).json({ message: "Failed to update price" });
  }
}

export async function updateMenuItemStock(req, res) {
  try {
    const { quantity_available } = req.body;

    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { quantity_available },
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(menu);
  } catch (error) {
    console.error("updateMenuItemStock error:", error);
    res.status(500).json({ message: "Failed to update stock" });
  }
}