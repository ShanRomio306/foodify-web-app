import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import Cart from "../models/Cart.js";

export async function placeOrder(req, res) {
  try {
    const { userId, note , restaurantId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = new Order({
      userId,
      restaurantId,
      items: cart.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        image: i.image,
        quantity: i.quantity,
      })),
      note,
      status: "placed",
      paymentStatus: "pending",
    });

    order.recalculate();
    await order.save();

    await Cart.deleteOne({ userId });

    res.status(201).json(order);
  } catch (err) {
    console.error("placeOrder error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
}

export async function getMyOrders(req, res) {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error("getMyOrders error:", err);
    return res.status(500).json([]);
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("getOrderById error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
}

export async function cancelOrder(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order cancelled" });
  } catch (err) {
    console.error("cancelOrder error:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("getAllOrders error:", err);
    res.status(500).json([]);
  }
}

export async function getOrdersByRestaurant(req, res) {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurantId" });
    }

    const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("getOrdersByRestaurant error:", err);
    res.status(500).json([]);
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const allowed = [
      "placed",
      "accepted",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
}