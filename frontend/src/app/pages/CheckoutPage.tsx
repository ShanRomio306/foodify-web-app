import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ShoppingBag } from "lucide-react";
import api from "../../services/api";

type Profile = {
  name: string;
  phone?: string;
  email?: string;
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, refreshCart } = useCart();

  const [note, setNote] = useState("");

  // Prefilled fields (editable, but NOT sent to backend)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;

        const res = await api.get<Profile>("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(res.data?.name || "");
        setPhone(res.data?.phone || "");
      } catch (err) {
        console.error("Failed to prefill profile on checkout", err);
        // keep fields empty if profile fetch fails
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <Button onClick={() => navigate("/restaurants")}>
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const placeOrder = async () => {
    try {
      const res = await api.post("/order", { userId, note });

      await refreshCart();
      const orderId = res.data?._id;
      navigate(`/payment/${orderId}`);
    } catch (err) {
      console.error("Order failed", err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 border">
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>

            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loadingProfile}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loadingProfile}
                />
              </div>

              {loadingProfile && (
                <p className="text-sm text-gray-500">Loading your details…</p>
              )}

              <p className="text-xs text-gray-500">
                You can edit these here if needed. (Not saved to your profile)
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border">
            <h2 className="text-xl font-bold mb-4">Special Instructions</h2>

            <Textarea
              placeholder="Any special requests..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white rounded-xl p-6 border sticky top-24 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-6">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-xl font-bold pt-2">
              <span>Total</span>
              <span className="text-orange-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
            size="lg"
            onClick={placeOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}