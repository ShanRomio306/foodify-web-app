import { useEffect, useState } from "react";
import { Users, Store, ShoppingBag, IndianRupeeIcon } from "lucide-react";
import api from "../../../../services/api";

type Restaurant = {
  id: number | string;
  name: string;
};

type Order = {
  id: number | string;
  total: number;
  createdAt: string;
};

type StatsData = {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
};

function extractArray(json: any): any[] {
  if (Array.isArray(json)) return json;
  if (json && typeof json === "object") {
    for (const key of ["data", "users", "restaurants", "orders", "results", "items"]) {
      if (Array.isArray(json[key])) return json[key];
    }
  }
  console.warn("Unexpected API response shape:", json);
  return [];
}

export function SuperAdminDashboard() {
  const [statsData, setStatsData] = useState<StatsData>({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [recentRestaurants, setRecentRestaurants] = useState<Restaurant[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, restaurantsRes, ordersRes] = await Promise.all([
          api.get("/users"),
          api.get("/rests"),
          api.get("/orders"),
        ]);

        console.log("Raw users response:", usersRes.data);
        console.log("Raw restaurants response:", restaurantsRes.data);
        console.log("Raw orders response:", ordersRes.data);

        const users = extractArray(usersRes.data);
        const restaurants: Restaurant[] = extractArray(restaurantsRes.data);
        const ordersApiData: any[] = extractArray(ordersRes.data);

        const orders: Order[] = ordersApiData.map((order) => ({
          id: order.id ?? order._id ?? "unknown",
          total: Number(order.total ?? order.total_amount ?? order.amount ?? 0),
          createdAt: order.createdAt ?? order.created_at ?? order.date ?? "",
        }));

        const totalRevenue = orders.reduce(
          (sum: number, order: Order) => sum + order.total,
          0
        );

        console.log("Parsed counts:", {
          users: users.length,
          restaurants: restaurants.length,
          orders: orders.length,
          totalRevenue,
        });

        setStatsData({
          totalUsers: users.length,
          totalRestaurants: restaurants.length,
          totalOrders: orders.length,
          totalRevenue,
        });

        setRecentRestaurants(restaurants.slice(0, 5));
        setRecentOrders(orders.slice(0, 5));
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: "Total Users",
      value: statsData.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Restaurants",
      value: statsData.totalRestaurants,
      icon: Store,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Total Orders",
      value: statsData.totalOrders,
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Total Revenue",
      value: `₹${statsData.totalRevenue.toFixed(2)}`,
      icon: IndianRupeeIcon,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Platform Overview</h1>
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Platform Overview</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error loading data:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Restaurants</h2>
          <div className="space-y-3">
            {recentRestaurants.length > 0 ? (
              recentRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg" />
                    <div>
                      <p className="font-medium text-gray-900">{restaurant.name}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent restaurants found.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.createdAt}</p>
                  </div>
                  <p className="font-medium text-gray-900">₹{order.total.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}