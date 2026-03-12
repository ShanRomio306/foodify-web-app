import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CreditCard, Smartphone, Banknote, Check } from "lucide-react";
import { PaymentSwipe } from "../components/PaymentSwipe";
import { toast } from "sonner";

type PaymentMethod = "upi" | "card" | "cash";

type Order = {
  _id: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
};

export function PaymentPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [showSwipe, setShowSwipe] = useState(false);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!orderId) return;
        const res = await api.get(`/order/${orderId}`);
        setOrder(res.data);
      } catch (e) {
        console.error("Failed to load order", e);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  
  //const handlePay = () => setShowSwipe(true);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!order) return <div className="p-8">Order not found.</div>;

  const subtotal = order.subtotal ?? 0;
  const tax = order.tax ?? 0;
  const total = order.total ?? 0;

  // ...keep the rest of your UI, but replace subtotal/tax/total usage with these values

  const handlePaymentComplete = async () => {
  try {
    toast.success("Payment successful! Your order has been placed.", {
      icon: <Check className="w-5 h-5" />,
    });

    if (orderId) {
      await api.patch(`/order/${orderId}/payment`, {
        paymentStatus: "paid",
        // optionally store method:
        // method: paymentMethod,
      });
    } else {
      console.warn("orderId missing, cannot update payment status");
    }

    setTimeout(() => {
      navigate("/orders");
    }, 1500);
  } catch (err) {
    console.error("Failed to update payment status", err);
    toast.error("Payment succeeded, but failed to update status. Please refresh.");
    // still navigate or keep user on page—your choice:
    setTimeout(() => navigate("/orders"), 1500);
  }
};

  const handlePay = () => {
    setShowSwipe(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>

        <div className="space-y-6">
          {/* Payment Method Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>
            
            <div className="grid gap-4">
              {/* UPI */}
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  paymentMethod === 'upi' ? 'bg-orange-600' : 'bg-gray-100'
                }`}>
                  <Smartphone className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">UPI Payment</p>
                  <p className="text-sm text-gray-500">Pay using UPI apps</p>
                </div>
                {paymentMethod === 'upi' && (
                  <Check className="w-6 h-6 text-orange-600" />
                )}
              </button>

              {/* Card */}
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'card'
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  paymentMethod === 'card' ? 'bg-orange-600' : 'bg-gray-100'
                }`}>
                  <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Credit/Debit Card</p>
                  <p className="text-sm text-gray-500">Pay using your card</p>
                </div>
                {paymentMethod === 'card' && (
                  <Check className="w-6 h-6 text-orange-600" />
                )}
              </button>

              {/* Cash */}
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  paymentMethod === 'cash' ? 'bg-orange-600' : 'bg-gray-100'
                }`}>
                  <Banknote className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Cash on Pickup</p>
                  <p className="text-sm text-gray-500">Pay when you collect</p>
                </div>
                {paymentMethod === 'cash' && (
                  <Check className="w-6 h-6 text-orange-600" />
                )}
              </button>
            </div>
          </div>

          {/* Payment Details Form */}
          {paymentMethod === 'upi' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">UPI Details</h3>
              <div>
                <Label htmlFor="upi">UPI ID</Label>
                <Input id="upi" placeholder="yourname@upi" />
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Card Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" type="password" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input id="cardName" placeholder="John Doe" />
                </div>
              </div>
            </div>
          )}

          {/* Order Total */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Order Total</h3>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Swipe or Button */}
            {!showSwipe ? (
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
                onClick={handlePay}
              >
                {paymentMethod === 'cash' ? 'Confirm Order' : 'Pay Now'}
              </Button>
            ) : (
              <PaymentSwipe amount={total} onComplete={handlePaymentComplete} />
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-medium">🔒 Secure Payment:</span> Your payment information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
