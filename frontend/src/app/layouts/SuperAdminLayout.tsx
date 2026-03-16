import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users,Store, LogOut } from "lucide-react";
import { toast } from "sonner";

export function SuperAdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast.success("User Logged Out Successfully");
  };

  const menuItems = [
    { path: "/super-admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/super-admin/users", icon: Users, label: "Users" },
    { path: "/super-admin/restaurants", icon: Store, label: "Restaurants" },
    { icon: LogOut, label: "SignOut", action: handleLogout },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Super Admin</h1>
          <p className="text-sm text-gray-500 mt-1"></p>
        </div>
        <nav className="px-4 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.path && location.pathname === item.path;

            // If item has action (like logout), render button
            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 w-full"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            }

            // Regular menu item with Link
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
