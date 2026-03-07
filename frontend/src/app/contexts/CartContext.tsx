import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../../services/api";

export interface CartItem {
  productId: string; // match backend
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartResponse {
  items: CartItem[];
  amount: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  amount: number;
  totalQuantity: number;

  refreshCart: () => Promise<void>;
  addToCart: (item: any) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  setItemQuantity: (productId: string, quantity: number) => Promise<void>;
  increment: (productId: string) => Promise<void>;
  decrement: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: any) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [amount, setAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  const userId = localStorage.getItem("userId");

  const applyCart = (data?: CartResponse) => {
    setCartItems(data?.items || []);
    setAmount(data?.amount || 0);
    setTotalQuantity(data?.quantity || 0);
  };

  const refreshCart = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/cart/${userId}`);
      applyCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const addToCart = async (item: any) => {
    if (!userId) return;

    try {
      const payload = {
        userId,
        productId: item._id, // your product uses _id
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        // restaurantId: item.restaurantId, // optional if you have it
      };

      const res = await api.post("/cart", payload);
      applyCart(res.data);
      setCartOpen(true);
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!userId) return;

    try {
      const res = await api.delete(`/cart/${userId}/item/${productId}`);
      applyCart(res.data);
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const setItemQuantity = async (productId: string, quantity: number) => {
    if (!userId) return;
    if (quantity < 1) return;

    try {
      const res = await api.patch(`/cart/${userId}/item/${productId}`, { quantity });
      applyCart(res.data);
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const increment = async (productId: string) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    await setItemQuantity(productId, item.quantity + 1);
  };

  const decrement = async (productId: string) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;

    if (item.quantity === 1) {
      await removeFromCart(productId);
    } else {
      await setItemQuantity(productId, item.quantity - 1);
    }
  };

  const clearCart = async () => {
    if (!userId) return;
    try {
      await api.delete(`/cart/${userId}`);
      applyCart({ items: [], amount: 0, quantity: 0 });
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartOpen,
        setCartOpen,
        amount,
        totalQuantity,
        refreshCart,
        addToCart,
        removeFromCart,
        setItemQuantity,
        increment,
        decrement,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};