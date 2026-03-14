import { useState, useEffect } from "react";
import { Search, Loader2, Users } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import api from "../../../../services/api";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  address?: string;
  createdAt?: string;
};

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setError(null);
      const res = await api.get("/users");
      const data = res.data;
      const list: User[] = Array.isArray(data)
        ? data
        : data.data || data.users || [];
      setUsers(list);
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || err.message || "Failed to load users";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      user: "bg-blue-100 text-blue-700",
      restaurant_admin: "bg-purple-100 text-purple-700",
      super_admin: "bg-red-100 text-red-700",
    };
    return colors[role] || colors.user;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.phone?.toLowerCase().includes(q) ||
      user.role?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Users Management</h1>
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <Badge className="bg-gray-100 text-gray-700 text-sm px-3 py-1">
          {users.length} total users
        </Badge>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-medium text-red-800">API Error</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => {
              setLoading(true);
              fetchUsers();
            }}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users by name, email, phone, role..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <p className="text-xs text-gray-400 mt-2">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">User</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Email</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Phone</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-blue-700">
                            {getInitials(user.name || "?")}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6 text-gray-600">{user.phone || "—"}</td>
                    <td className="py-4 px-6">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role.replace("_", " ").toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {searchQuery
                        ? `No users match "${searchQuery}"`
                        : "No users found"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}