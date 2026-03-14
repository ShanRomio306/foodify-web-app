import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { toast } from "sonner";

export function RestaurantDashboard() {
  const restaurantId = localStorage.getItem("restaurantId");

  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    menuItems: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async (showToast = false) => {
    if (!restaurantId) return;
    
    try {
      const [ordersRes, menuRes] = await Promise.all([
        api.get(`/orders/restaurant/${restaurantId}`),
        api.get(`/rests/${restaurantId}/menu`),
      ]);

      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const menu = Array.isArray(menuRes.data) ? menuRes.data : [];

      const res = await api.get(`/rests/${restaurantId}/dashboard-stats`);

      setStats({
      orders: Number(res.data?.orders || 0),
      revenue: Number(res.data?.revenue || 0),
      menuItems: Number(res.data?.menuItems || 0),
    });
    } catch (error: any) {
      console.error(
        "Failed to load dashboard:",
        error?.response?.data || error.message
      );

      if (showToast) {
        toast.error(error?.response?.data?.message || "Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!restaurantId) {
      toast.error("Restaurant ID not found");
      setLoading(false);
      return;
    }

    loadDashboard(true);

    const interval = setInterval(() => {
      loadDashboard(false);
    }, 5000);

    const handleFocus = () => {
      loadDashboard(false);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Restaurant Dashboard</h1>
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Restaurant Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-3xl font-bold">{stats.orders}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-3xl font-bold">₹{stats.revenue}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-500">Menu Items</p>
          <h2 className="text-3xl font-bold">{stats.menuItems}</h2>
        </div>
      </div>
    </div>
  );
}