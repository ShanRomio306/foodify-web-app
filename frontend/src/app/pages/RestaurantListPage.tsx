import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { RestaurantCard } from "../components/RestaurantCard";
import api from "../../services/api";
import { Badge } from "../components/ui/badge";

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisines: string[];
  rating: number;
  image: string;
  avgDeliveryTime: string;
  minOrder: number;
}

export function RestaurantListPage() {

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {

      const res = await api.get("/rests");

      setRestaurants(res.data);
      setFilteredRestaurants(res.data);

    } catch (err) {
      console.error("Failed to load restaurants", err);
    }
  };

  useEffect(() => {

    let result = restaurants;

    if (searchQuery) {
      result = result.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCuisine) {
      result = result.filter((r) =>
        r.cuisines?.includes(selectedCuisine)
      );
    }

    setFilteredRestaurants(result);

  }, [searchQuery, selectedCuisine, restaurants]);

  const allCuisines = Array.from(
    new Set(restaurants.flatMap((r) => r.cuisines || []))
  );

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Restaurants
          </h1>

          <p className="text-gray-600">
            Discover amazing food near you
          </p>

        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">

          <div className="flex gap-4 mb-4">

            <div className="flex-1 relative">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <Input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />

            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>

          </div>

          {/* Cuisine filters */}
          {showFilters && (

            <div className="pt-4 border-t border-gray-200">

              <h3 className="font-medium text-gray-900 mb-3">
                Filter by Cuisine
              </h3>

              <div className="flex flex-wrap gap-2">

                <Badge
                  variant={selectedCuisine === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCuisine(null)}
                >
                  All
                </Badge>

                {allCuisines.map((cuisine) => (

                  <Badge
                    key={cuisine}
                    variant={selectedCuisine === cuisine ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCuisine(cuisine)}
                  >
                    {cuisine}
                  </Badge>

                ))}

              </div>

            </div>

          )}

        </div>

        {/* Results count */}
        <div className="mb-6">

          <p className="text-gray-600">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {filteredRestaurants.length}
            </span>{" "}
            restaurants
          </p>

        </div>

        {/* Restaurant grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredRestaurants.map((restaurant) => (

            <RestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
            />

          ))}

        </div>

        {filteredRestaurants.length === 0 && (

          <div className="text-center py-16">

            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No restaurants found
            </h3>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCuisine(null);
              }}
            >
              Clear Filters
            </Button>

          </div>

        )}

      </div>

    </div>
  );
}