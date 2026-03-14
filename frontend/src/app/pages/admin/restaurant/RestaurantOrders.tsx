import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  restaurantId?: string;
  items: OrderItem[];
  amount: number;
  quantity: number;
  subtotal: number;
  tax: number;
  total: number;
  status: "placed" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  note?: string;
  createdAt: string;
}

const statuses = ["placed", "accepted", "preparing", "ready", "completed", "cancelled"];

export function RestaurantOrders() {
  const restaurantId = localStorage.getItem("restaurantId") || "";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!restaurantId) {
      toast.error("Restaurant ID not found");
      return;
    }
    fetchOrders();
  }, [restaurantId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/restaurant/${restaurantId}`);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/order/${orderId}/status`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Restaurant Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-xl p-5 bg-white shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <p className="font-semibold">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm">Status: <span className="font-medium">{order.status}</span></p>
                  <p className="text-sm">Payment: <span className="font-medium">{order.paymentStatus}</span></p>
                  {order.note && <p className="text-sm">Note: {order.note}</p>}
                </div>

                <div className="text-right">
                  <p>Total Items: {order.quantity}</p>
                  <p>Subtotal: ₹{order.subtotal}</p>
                  <p>Tax: ₹{order.tax}</p>
                  <p className="font-bold">Total: ₹{order.total}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-semibold mb-2">Items</p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between border rounded p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p>₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={order.status === status ? "default" : "outline"}
                    onClick={() => updateStatus(order._id, status)}
                    className={order.status === status ? "bg-orange-600 hover:bg-orange-700" : ""}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}