import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </CartProvider>
  );
}