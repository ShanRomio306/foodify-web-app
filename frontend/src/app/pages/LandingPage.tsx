import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, UtensilsCrossed, Clock, Star, ArrowRight } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { RestaurantCard } from "../components/RestaurantCard";

import api from "../../services/api";

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  image: string;
  open: boolean;
}

export function LandingPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/rests");
        setRestaurants(res.data);
      } catch (error) {
        console.error("Failed to fetch restaurants", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const featuredRestaurants = restaurants.slice(0, 3);

    return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Order Delicious Food for Takeaway
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8">
              Browse restaurants, order online, and pick up your favorite meals
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-full p-2 flex items-center gap-2 max-w-2xl mx-auto shadow-xl">
              <Search className="w-6 h-6 text-gray-400 ml-4" />
              <Input
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes..."
                className="border-0 focus-visible:ring-0 text-gray-900 text-lg"
              />
              <Button size="lg" className="rounded-full bg-orange-600 hover:bg-orange-700 px-8">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Choose from hundreds of restaurants and thousands of dishes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Pickup</h3>
              <p className="text-gray-600">
                Order ahead and pick up your food when it's ready
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Food</h3>
              <p className="text-gray-600">
                Only the best restaurants with verified reviews
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Restaurants</h2>
              <p className="text-gray-600">Popular choices in your area</p>
            </div>
            <Link to="/restaurants">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to order?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of satisfied customers
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/restaurants">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Browse Restaurants
              </Button>
            </Link>
            {/* <Link to="/register">
              <Button size="lg" variant="outline" className="bg-white text-orange-600 hover:bg-gray-100">
                Create Account
              </Button>
            </Link> */}
          </div>
        </div>
      </section>
    </div>
  );
}
