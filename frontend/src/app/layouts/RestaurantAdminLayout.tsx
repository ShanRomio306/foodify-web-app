import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Settings, Tag, FolderTree } from "lucide-react";

export function RestaurantAdminLayout() {
  const location = useLocation();

  const menuItems = [
    { path: "/restaurant-admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/restaurant-admin/menu", icon: UtensilsCrossed, label: "Menu" },
     { path: "/restaurant-admin/orders", icon: ShoppingBag, label: "Orders" },
    //{ path: "/restaurant-admin/offers", icon: Tag, label: "Offers" },
    { path: "/restaurant-admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Admin</h1>
          <p className="text-sm text-gray-500 mt-1"></p>
        </div>
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
