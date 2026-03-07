import { useEffect, useMemo, useState } from "react";
import { Calendar, Receipt, ShoppingBag } from "lucide-react";
import api from "../../services/api";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status?: string;
  createdAt: string;
}

function statusClasses(status?: string) {
  const s = (status || "placed").toLowerCase();
  if (s === "completed")
    return "bg-green-50 text-green-700 border-green-200";
  if (s === "cancelled")
    return "bg-red-50 text-red-700 border-red-200";
  if (s === "preparing" || s === "accepted" || s === "ready")
    return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
}

export function MyOrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + (o.total || 0), 0),
    [orders]
  );

  const totalItems = useMemo(
    () =>
      orders.reduce(
        (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
        0
      ),
    [orders]
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);

      if (!userId) {
        setOrders([]);
        return;
      }

      const res = await api.get(`/order/user/${userId}`);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-xl rounded-2xl border shadow-sm p-10 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600 mb-6">
            Your orders will appear here once you place them.
          </p>

          <div className="flex gap-3 justify-center">
            <Button
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => navigate("/restaurants")}
            >
              Browse Restaurants
            </Button>
            <Button variant="outline" onClick={fetchOrders}>
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                My Orders
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Review your recent orders and totals.
              </p>
            </div>

            <Button variant="outline" onClick={fetchOrders}>
              Refresh
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Total Items</p>
              <p className="text-xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Total Spent</p>
              <p className="text-xl font-bold text-orange-600">
                ₹{totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-5">
          {orders.map((order) => {
            const itemCount = order.items.reduce(
              (sum, i) => sum + i.quantity,
              0
            );

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              >
                {/* Top bar */}
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-orange-600" />
                        <h3 className="font-bold text-gray-900">
                          Order #{order._id.slice(-6)}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>{itemCount} item(s)</span>
                      </div>
                    </div>

                    <Badge className={statusClasses(order.status)}>
                      {(order.status || "placed").toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6">
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-700">
                          {item.name}{" "}
                          <span className="text-gray-400">
                            × {item.quantity}
                          </span>
                        </span>
                        <span className="font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-5 pt-4 border-t space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{(order.subtotal ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>₹{(order.tax ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span className="text-orange-600">
                        ₹{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions (optional UI-only; no functionality change) */}
                  {/* <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(order._id)}
                    >
                      Copy Order ID
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/restaurants")}
                    >
                      Order Again
                    </Button>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}