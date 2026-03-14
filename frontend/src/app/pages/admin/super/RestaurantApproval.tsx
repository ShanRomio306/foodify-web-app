import { useState, useEffect } from "react";
import { Eye, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import api from "../../../../services/api";

type Restaurant = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  image: string;
  address: string;
  cuisines: string[];
  rating: number;
  totalReviews: number;
  open: boolean;
  approved: boolean;
  createdAt?: string;
};

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  address: "",
  description: "",
  cuisines: "",
  image: "",
};

export function RestaurantApproval() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    try {
      const res = await api.get("/rests");
      const data = res.data;
      const list: Restaurant[] = Array.isArray(data)
        ? data
        : data.data || data.restaurants || [];
      setRestaurants(list);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ FIXED: Proper two-step creation with rollback
  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    let createdUserId: string | null = null;

    try {
      // Step 1: Create restaurant_admin user
      const userRes = await api.post("/users/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        address: formData.address.trim() || "",
        role: "restaurant_admin",
      });

      // ✅ Save user ID for rollback if Step 2 fails
      createdUserId = userRes.data?.user?._id || null;

      // Step 2: Create restaurant entry
      await api.post("/rests", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim() || undefined,
        description: formData.description.trim() || undefined,
        image: formData.image.trim() || undefined,
        cuisines: formData.cuisines
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      });

      toast.success("Restaurant & admin account created successfully!");
      setFormData(initialFormState);
      setShowAddForm(false);
      fetchRestaurants();
    } catch (err: any) {
      console.error("Error during restaurant creation:", err);

      // ✅ FIX: Rollback — if user was created but restaurant failed, delete the user
      if (createdUserId) {
        try {
          await api.delete(`/users/${createdUserId}`);
          console.log("Rolled back: deleted orphaned user", createdUserId);
        } catch (rollbackErr) {
          console.error("Rollback failed:", rollbackErr);
        }
      }

      const errorMessage =
        err.response?.data?.message || "Failed to add restaurant";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Delete "${name}"?\nThis will also remove the associated admin account.`
      )
    )
      return;

    setDeletingId(id);
    try {
      await api.delete(`/rests/${id}`);
      toast.success(`"${name}" deleted successfully`);
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to delete restaurant"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Restaurant Management
        </h1>
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading restaurants...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Restaurant Management
        </h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowAddForm((v) => !v)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? "Close Form" : "Add Restaurant"}
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Add New Restaurant
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            This will also create a <strong>restaurant_admin</strong> user
            account with the same email.
          </p>

          <form onSubmit={handleAddRestaurant}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Pizza Palace"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="restaurant@example.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisines
                </label>
                <input
                  type="text"
                  name="cuisines"
                  value={formData.cuisines}
                  onChange={handleInputChange}
                  placeholder="Indian, Chinese, Italian"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">Comma-separated values</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Link
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="www.image.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="A short description of the restaurant..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Restaurant"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData(initialFormState);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {restaurants.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 text-lg">No restaurants found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Click "Add Restaurant" to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-start gap-6">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/128?text=No+Image";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {restaurant.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-1">
                        {restaurant.description}
                      </p>
                      <p className="text-gray-400 text-xs">{restaurant.email}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Badge
                        className={
                          restaurant.open
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {restaurant.open ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Cuisines</p>
                      <p className="text-sm font-medium text-gray-900">
                        {restaurant.cuisines?.length > 0
                          ? restaurant.cuisines.join(", ")
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rating</p>
                      <p className="text-sm font-medium text-gray-900">
                        ⭐ {restaurant.rating} ({restaurant.totalReviews} reviews)
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">
                        {restaurant.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {restaurant.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(`/restaurant/${restaurant._id}`, "_blank")
                      }
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-auto text-red-600 border-red-200 hover:bg-red-50"
                      disabled={deletingId === restaurant._id}
                      onClick={() =>
                        handleDelete(restaurant._id, restaurant.name)
                      }
                    >
                      {deletingId === restaurant._id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}