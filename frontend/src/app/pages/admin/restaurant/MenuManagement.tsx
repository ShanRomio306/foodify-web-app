import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Save, X, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import api from "../../../../services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  category: string;
  price: number;
  quantity_available: number;
  image?: string;
  description?: string;
  isAvailable?: boolean;
}

export function MenuManagement() {
  const navigate = useNavigate();

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    price: 0,
    quantity_available: 0,
    description: "",
    image: "",
  });

  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");

    if (
      !storedRestaurantId ||
      storedRestaurantId === "null" ||
      storedRestaurantId === "undefined" ||
      storedRestaurantId.trim() === ""
    ) {
      toast.error("Restaurant ID not found. Please login again.");
      setIsLoading(false);
      return;
    }

    const objectIdRegex = /^[a-fA-F0-9]{24}$/;
    if (!objectIdRegex.test(storedRestaurantId)) {
      toast.error("Invalid Restaurant ID format. Please login again.");
      setIsLoading(false);
      return;
    }

    setRestaurantId(storedRestaurantId);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (restaurantId) {
      fetchMenu();
    }
  }, [restaurantId]);

  const fetchMenu = async () => {
    if (!restaurantId) return;

    try {
      const res = await api.get(`/rests/${restaurantId}/menu`);
      setMenu(Array.isArray(res.data) ? res.data : []);
    } catch (error: any) {
      console.error("Failed to load menu:", error.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Failed to load menu");
    }
  };

  const handleAdd = async () => {
    if (!restaurantId) {
      toast.error("Restaurant ID not found. Please login again.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter item name");
      return;
    }

    if (!category.trim()) {
      toast.error("Please enter category");
      return;
    }

    if (price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (quantity < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    try {
      await api.post(`/rests/${restaurantId}/menu`, {
        name: name.trim(),
        category: category.trim(),
        price: Number(price),
        quantity_available: Number(quantity),
        description: description.trim(),
        image: image.trim(),
      });

      toast.success("Menu item added");

      setName("");
      setCategory("");
      setPrice(0);
      setQuantity(0);
      setDescription("");
      setImage("");

      fetchMenu();
    } catch (error: any) {
      console.error("Add failed:", error.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Add failed");
    }
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item._id);
    setEditForm({
      name: item.name,
      category: item.category,
      price: item.price,
      quantity_available: item.quantity_available,
      description: item.description || "",
      image: item.image || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: "",
      category: "",
      price: 0,
      quantity_available: 0,
      description: "",
      image: "",
    });
  };

  const handleUpdate = async (menuId: string) => {
    if (!restaurantId) {
      toast.error("Restaurant ID not found");
      return;
    }

    if (!editForm.name.trim()) {
      toast.error("Please enter item name");
      return;
    }

    if (!editForm.category.trim()) {
      toast.error("Please enter category");
      return;
    }

    if (editForm.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (editForm.quantity_available < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    try {
      await api.patch(`/rests/${restaurantId}/menu/${menuId}`, {
        name: editForm.name.trim(),
        category: editForm.category.trim(),
        price: Number(editForm.price),
        quantity_available: Number(editForm.quantity_available),
        description: editForm.description.trim(),
        image: editForm.image.trim(),
      });

      toast.success("Menu item updated");
      cancelEdit();
      fetchMenu();
    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (menuId: string) => {
    if (!restaurantId) {
      toast.error("Restaurant ID not found");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await api.delete(`/rests/${restaurantId}/menu/${menuId}`);
      toast.success("Deleted");
      fetchMenu();
    } catch (error: any) {
      console.error("Delete failed:", error.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleReLogin = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Restaurant Not Found</h2>
          <p className="text-red-600 mb-4">
            Restaurant ID is missing or invalid. Please login again to continue.
          </p>
          <Button onClick={handleReLogin} className="bg-red-600 hover:bg-red-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Menu Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label>Item Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name"
          />
        </div>

        <div>
          <Label>Category *</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />
        </div>

        <div>
          <Label>Price *</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label>Quantity</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Quantity"
            min="0"
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </div>

        <div>
          <Label>Image URL</Label>
          <Input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
          />
        </div>
      </div>

      <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700">
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>

      <div className="mt-8 space-y-4">
        {menu.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No menu items found. Add your first item above!</p>
          </div>
        ) : (
          menu.map((menuItem) => (
            <div key={menuItem._id} className="border rounded p-4">
              {editingId === menuItem._id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Item name"
                  />
                  <Input
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    placeholder="Category"
                  />
                  <Input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    placeholder="Price"
                    min="0"
                    step="0.01"
                  />
                  <Input
                    type="number"
                    value={editForm.quantity_available}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        quantity_available: Number(e.target.value),
                      })
                    }
                    placeholder="Quantity"
                    min="0"
                  />
                  <Input
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Description"
                  />
                  <Input
                    value={editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    placeholder="Image URL"
                  />

                  <div className="flex gap-2 md:col-span-2">
                    <Button
                      onClick={() => handleUpdate(menuItem._id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>

                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    {menuItem.image && (
                      <img
                        src={menuItem.image}
                        alt={menuItem.name}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div>
                      <p className="font-bold text-lg">{menuItem.name}</p>
                      <p className="text-sm text-gray-500">{menuItem.category}</p>
                      <p className="text-orange-600 font-semibold">₹{menuItem.price}</p>
                      <p className="text-sm">Stock: {menuItem.quantity_available}</p>
                      {menuItem.description && (
                        <p className="text-sm text-gray-600 mt-1">{menuItem.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => startEdit(menuItem)}>
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button variant="destructive" onClick={() => handleDelete(menuItem._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}