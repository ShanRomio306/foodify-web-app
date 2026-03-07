import { Order } from "../models/Order.js";
import Cart from "../models/Cart.js";

export async function placeOrder(req, res) {
  try {
    const { userId, note } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });

    // Best approach: build order from cart so restaurantId is available and totals are trusted
    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = new Order({
      userId,
      restaurantId: cart.restaurantId || undefined,
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

    // clear cart after order placed
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
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.json(orders); // always array
  } catch (err) {
    console.error("getMyOrders error:", err);
    return res.status(500).json([]); // never null
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    console.error("getOrderById error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
}

export async function cancelOrder(req, res) {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order cancelled" });
  } catch (err) {
    console.error("cancelOrder error:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
}

// For admin order management page:
export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
}