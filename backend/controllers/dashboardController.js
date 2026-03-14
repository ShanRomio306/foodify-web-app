import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import Menu from "../models/Menu.js";

export async function getRestaurantDashboardStats(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant id" });
    }

    const restaurantObjectId = new mongoose.Types.ObjectId(id);

    const [ordersCount, menuItemsCount, revenueAgg] = await Promise.all([
      Order.countDocuments({ restaurantId: restaurantObjectId }),
      Menu.countDocuments({ restaurantId: restaurantObjectId }),
      Order.aggregate([
        { $match: { restaurantId: restaurantObjectId } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    const revenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.json({
      orders: ordersCount,
      revenue,
      menuItems: menuItemsCount,
    });
  } catch (error) {
    console.error("getRestaurantDashboardStats error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
}