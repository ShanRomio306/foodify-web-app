import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { toast } from "sonner";

interface Restaurant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  address?: string;
  image?: string;
}

export function RestaurantSettings() {
  const restaurantId = localStorage.getItem("restaurantId") || "";
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      toast.error("Restaurant ID not found");
      return;
    }
    loadRestaurant();
  }, [restaurantId]);

  const loadRestaurant = async () => {
    try {
      const res = await api.get(`/rests/${restaurantId}`);
      setRestaurant(res.data);
    } catch {
      toast.error("Failed to load restaurant details");
    }
  };

  const saveSettings = async () => {
    if (!restaurant?._id) return;

    try {
      await api.put(`/rests/${restaurant._id}`, {
        name: restaurant.name,
        phone: restaurant.phone,
        description: restaurant.description,
        address: restaurant.address,
        image: restaurant.image,
      });

      toast.success("Settings updated");
      loadRestaurant();
    } catch {
      toast.error("Update failed");
    }
  };

  if (!restaurant) return null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Restaurant Settings</h1>

      <div className="space-y-4 max-w-lg">
        <div>
          <Label>Name</Label>
          <Input
            value={restaurant.name}
            onChange={(e) =>
              setRestaurant({
                ...restaurant,
                name: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input value={restaurant.email} disabled />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            value={restaurant.phone}
            onChange={(e) =>
              setRestaurant({
                ...restaurant,
                phone: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={restaurant.description}
            onChange={(e) =>
              setRestaurant({
                ...restaurant,
                description: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label>Address</Label>
          <Input
            value={restaurant.address || ""}
            onChange={(e) =>
              setRestaurant({
                ...restaurant,
                address: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label>Image URL</Label>
          <Input
            value={restaurant.image || ""}
            onChange={(e) =>
              setRestaurant({
                ...restaurant,
                image: e.target.value,
              })
            }
          />
        </div>

        <Button className="bg-orange-600 hover:bg-orange-700" onClick={saveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}