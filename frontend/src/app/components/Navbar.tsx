import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCart } from "../contexts/CartContext";
import { Badge } from "./ui/badge";

export function Navbar() {
  const location = useLocation();
  const { setCartOpen, cartItems } = useCart();

const cartCount = cartItems.reduce(
  (count, item) => count + item.quantity,
  0
);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Foodify</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for restaurants, cuisines..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link to="/restaurants">
              <Button variant={location.pathname === "/restaurants" ? "default" : "ghost"}>
                Restaurants
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant={location.pathname === "/orders" ? "default" : "ghost"}>
                My Orders
              </Button>
            </Link>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* User Profile */}
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search - Shown on mobile */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search restaurants..."
            className="pl-10 w-full"
          />
        </div>
      </div>
    </nav>
  );
}
