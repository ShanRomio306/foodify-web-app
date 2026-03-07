import { Plus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "../contexts/CartContext";

interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  quantity_available?: number;
  // restaurantId?: string; // uncomment if you have it and want to enforce single-restaurant cart
}

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart, cartItems, setCartOpen } = useCart();

  const inStock =
    item.quantity_available === undefined || item.quantity_available > 0;

  // With the fixed backend, cart items contain `productId`
  const isInCart = cartItems.some((ci) => ci.productId === item._id);

  const handleAdd = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // You can replace this with a toast / modal if you have one
      alert("Please login to add items to cart.");
      return;
    }

    await addToCart(item);
    setCartOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            item.image ||
            "https://images.unsplash.com/photo-1550547660-d9450f859349"
          }
          alt={item.name}
          className="w-full h-full object-cover"
        />

        {item.category && (
          <Badge className="absolute top-3 left-3 bg-orange-600">
            {item.category}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {item.description || "Delicious food item"}
        </p>

        {/* Price + Add */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">₹{item.price}</span>

          {inStock ? (
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
              onClick={handleAdd}
            >
              {isInCart ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Add more
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          ) : (
            <Badge variant="outline" className="text-red-500 border-red-200">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}