import { X, Trash2, ShoppingBag, Minus, Plus } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function CartDrawer() {
  const {
    cartItems,
    cartOpen,
    setCartOpen,
    removeFromCart,
    increment,
    decrement,
    amount, // optional (if you added it in context)
  } = useCart();

  const navigate = useNavigate();

  // If you didn't add `amount` to context, keep local calculation.
  const subtotal =
    typeof amount === "number"
      ? amount
      : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            <span className="text-sm text-gray-500">
              ({cartItems.length} items)
            </span>
          </div>

          <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500">
                Add some delicious items to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1550547660-d9450f859349"
                      }
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            ${item.price}
                          </p>
                        </div>

                        {/* Remove */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Quantity controls */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => decrement(item.productId)}
                            className="h-8 w-8"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>

                          <span className="min-w-8 text-center text-sm text-gray-700">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => increment(item.productId)}
                            className="h-8 w-8"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* optional */}
                      <div className="mt-2 text-xs text-gray-500">
                        Item total includes quantity
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-orange-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              size="lg"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}