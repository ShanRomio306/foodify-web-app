import Rest from "../models/Restaurant.js";
import mongoose from "mongoose";
import User from "../models/Users.js";
import bcrypt from "bcrypt";


export const addRest = async (req, res) => {
  try {
    const { name, email, phone, description, address, cuisines, image } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Name, email, and phone are required",
      });
    }

    const existingRest = await Rest.findOne({ email });
    if (existingRest) {
      return res.status(400).json({
        message: "Restaurant with this email already exists",
      });
    }

    // ✅ Only create restaurant — user already created via /users/register
    const newRest = new Rest({
      name,
      email,
      phone,
      description: description || undefined,
      address: address || undefined,
      image: image || undefined,
      cuisines: Array.isArray(cuisines) ? cuisines : [],
      approved: true,
    });
    await newRest.save();

    return res.status(201).json({
      message: "Restaurant created successfully",
      restaurant: newRest,
    });
  } catch (error) {
    console.error("Error adding restaurant:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /rests/:id — Delete restaurant + associated admin user
export async function deleteRest(req, res){
  try {
    const { id } = req.params;

    const restaurant = await Rest.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Delete the associated restaurant_admin user by matching email + role
    await User.findOneAndDelete({
      email: restaurant.email,
      role: "restaurant_admin",
    });

    // Delete the restaurant
    await Rest.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Restaurant and associated admin account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export async function updateRestaurant(req, res) {
  try {
    const rest = await Rest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!rest) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(rest);
  } catch (error) {
    res.status(500).json({ message: "Failed to update restaurant" });
  }
}


export async function getRestaurantById(req, res) {
  try {
    const rest = await Rest.findById(req.params.id);

    if (!rest) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(rest);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurant" });
  }
}

export async function getRestaurantByEmail(req, res) {
  try {
    const { email } = req.params;
    const directResult = await mongoose.connection.db
      .collection("rests")
      .findOne({ email: email });
    const rest = await Rest.findOne({ email: email });
    
    if (!rest) {
      if (directResult) {
        return res.json(directResult);
      }
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(rest);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch restaurant", 
      error: error.message 
    });
  }
}



export async function getAllRestaurants(req, res) {
  try {
    const rest = await Rest.find();
    res.json(rest);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
}

export async function openRestaurant(req, res) {
  try {
    const rest = await Rest.findByIdAndUpdate(
      req.params.id,
      { open: true },
      { new: true }
    );

    if (!rest) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(rest);
  } catch (error) {
    res.status(500).json({ message: "Failed to open restaurant" });
  }
}

export async function closeRestaurant(req, res) {
  try {
    const rest = await Rest.findByIdAndUpdate(
      req.params.id,
      { open: false },
      { new: true }
    );

    if (!rest) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(rest);
  } catch (error) {
    res.status(500).json({ message: "Failed to close restaurant" });
  }
}

export async function updateRestaurantTimings(req, res) {
  try {
    const { open_at, close_at } = req.body;

    const rest = await Rest.findByIdAndUpdate(
      req.params.id,
      { open_at, close_at },
      { new: true }
    );

    if (!rest) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(rest);
  } catch (error) {
    res.status(500).json({ message: "Failed to update timings" });
  }
}

export const approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Rest.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.approved = true;
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Approval failed" });
  }
};