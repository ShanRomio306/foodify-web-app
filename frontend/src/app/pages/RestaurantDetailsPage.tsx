import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, Phone, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { MenuItemCard } from "../components/MenuItemCard";
import { Badge } from "../components/ui/badge";
import api from "../../services/api";

interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  rating?: number;
  totalReviews?: number;
  avgDeliveryTime?: string;
  address?: string;
  phone?: string;
  cuisines?: string[];
  open?: boolean;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}

export function RestaurantDetailsPage() {

  const { id } = useParams();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchRestaurant();
    fetchMenu();
  }, [id]);

  const fetchRestaurant = async () => {

    try {

      const res = await api.get(`/rests/${id}`);
      setRestaurant(res.data);

    } catch (err) {
      console.error("Failed to load restaurant", err);
    }

  };

  const fetchMenu = async () => {

    try {

      const res = await api.get(`/rests/${id}/menu`);
      setMenuItems(res.data);

    } catch (err) {
      console.error("Failed to load menu", err);
    }

  };

  if (!restaurant) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading restaurant...
      </div>
    );

  }

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  const filteredMenu =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (

    <div className="min-h-screen bg-gray-50">

      {/* Hero */}

      <div className="relative h-80 bg-gray-900">

        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-75"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 text-white p-8">

          <div className="max-w-7xl mx-auto">

            <Badge className={restaurant.open ? "bg-green-500 mb-3" : "bg-red-500 mb-3"}>
              {restaurant.open ? "Open Now" : "Closed"}
            </Badge>

            <h1 className="text-4xl font-bold mb-2">
              {restaurant.name}
            </h1>

            <p className="text-lg text-gray-200 mb-4">
              {restaurant.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">

              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current text-yellow-400" />
                <span>{restaurant.rating ?? 4}</span>
                <span>({restaurant.totalReviews ?? 0})</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{restaurant.avgDeliveryTime ?? "30 mins"}</span>
              </div>

              {restaurant.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{restaurant.address}</span>
                </div>
              )}

              {restaurant.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>{restaurant.phone}</span>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Content */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Tabs defaultValue="menu">

          <TabsList>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          {/* Menu */}

          <TabsContent value="menu">

            <div className="mb-6 flex flex-wrap gap-2">

              <Badge
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className="cursor-pointer"
              >
                All
              </Badge>

              {categories.map((cat) => (

                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat!)}
                  className="cursor-pointer"
                >
                  {cat}
                </Badge>

              ))}

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredMenu.map((item) => (

                <MenuItemCard
                  key={item._id}
                  item={item as any}
                />

              ))}

            </div>

          </TabsContent>

          {/* Info */}

          <TabsContent value="info">

            <div className="bg-white rounded-xl p-6 border">

              <h3 className="text-lg font-bold mb-4">
                Restaurant Information
              </h3>

              <p className="text-gray-600">
                {restaurant.description}
              </p>

            </div>

          </TabsContent>

        </Tabs>

      </div>

    </div>
  );
}