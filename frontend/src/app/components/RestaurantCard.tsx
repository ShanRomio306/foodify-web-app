import { Star, Clock, DollarSign,IndianRupee } from "lucide-react";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

interface Restaurant {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  image?: string;
  cuisines?: string[];
  rating?: number;
  totalReviews?: number;
  avgDeliveryTime?: string;
  minOrder?: number;
  open?: boolean;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link to={`/restaurant/${restaurant._id || restaurant.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 cursor-pointer group">

        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              restaurant.image ||
              "https://images.unsplash.com/photo-1555992336-03a23c7b20ee"
            }
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Open / Closed */}
          <div className="absolute top-3 right-3">
            <Badge className={restaurant.open ? "bg-green-500" : "bg-red-500"}>
              {restaurant.open ? "Open" : "Closed"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">

          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {restaurant.name}
          </h3>

          <p className="text-sm text-gray-500 mb-3 line-clamp-1">
            {restaurant.description || "Great food available here"}
          </p>

          {/* Cuisines */}
          <div className="flex flex-wrap gap-2 mb-3">
            {restaurant.cuisines?.slice(0, 3).map((cuisine) => (
              <Badge key={cuisine} variant="outline" className="text-xs">
                {cuisine}
              </Badge>
            ))}
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between text-sm">

            <div className="flex items-center gap-1 text-yellow-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium">
                {restaurant.rating ?? 4}
              </span>
              <span className="text-gray-400">
                ({restaurant.totalReviews ?? 0})
              </span>
            </div>

            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{restaurant.avgDeliveryTime ?? "30 mins"}</span>
            </div>

            <div className="flex items-center gap-1 text-gray-500">
              <IndianRupee className="w-4 h-4" />
              <span>Min ₹{restaurant.minOrder ?? 10}</span>
            </div>

          </div>

        </div>
      </div>
    </Link>
  );
}
