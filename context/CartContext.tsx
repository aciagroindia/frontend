"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  slug: string;
  variant?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: any,
    quantity?: number,
    silent?: boolean
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, delta: number) => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // ---------------- NORMALIZE ----------------
  const normalizeCartItems = (items: any[]): CartItem[] => {
    if (!Array.isArray(items)) return [];
    return items.map((item: any) => ({
      id: item._id,
      productId: item.product?._id,
      name: item.product?.name || "Product",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 0,
      image:
        item.product?.image ||
        (item.product?.images && item.product.images[0]) ||
        "",
      stock: Number(item.product?.stock) || 0,
      slug: item.product?.slug || "",
      variant: item.variant || "",
    }));
  };

  // ---------------- FETCH CART ----------------
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartTotal(0);
      return;
    }

    try {
      const response = await axiosInstance.get("/cart");
      if (response.data.success) {
        const cartData = response.data.data;
        const items = normalizeCartItems(cartData.items);

        setCartItems(items);

        const totalFromBackend = Number(cartData.totalPrice);
        if (!isNaN(totalFromBackend)) {
          setCartTotal(totalFromBackend);
        } else {
          setCartTotal(
            items.reduce((acc, i) => acc + i.price * i.quantity, 0)
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ---------------- ADD TO CART ----------------
  const addToCart = async (
    product: any,
    quantity = 1,
    silent = false
  ) => {
    if (!isAuthenticated) {
      if (!silent) toast.error("Please log in first.");
      return;
    }

    try {
      const response = await axiosInstance.post("/cart/add", {
        productId: product._id || product.id,
        quantity,
      });

      if (response.data.success) {
        await fetchCart();
        if (!silent) {
          toast.success("Added to cart!");
          setIsCartOpen(true);
        }
      }
    } catch (err: any) {
      if (!silent) {
        toast.error(err.response?.data?.message || "Error adding to cart.");
      }
    }
  };

  // ---------------- REMOVE ----------------
  const removeFromCart = async (itemId: string) => {
    if (!isAuthenticated) return;

    const prevItems = [...cartItems];

    // Optimistic remove
    const updatedItems = prevItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);
    setCartTotal(updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0));

    try {
      const res = await axiosInstance.delete(`/cart/remove/${itemId}`);

      if (res.data?.success) {
        toast.success("Item removed from cart.");
        await fetchCart(); // Sync with backend
      } else {
        throw new Error(res.data?.message || "Could not remove item.");
      }
    } catch (err: any) {
      // Rollback on any error
      setCartItems(prevItems);
      setCartTotal(prevItems.reduce((acc, i) => acc + i.price * i.quantity, 0));
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  // ---------------- UPDATE QUANTITY ----------------
  const updateQuantity = async (itemId: string, delta: number) => {
    if (!isAuthenticated) return;

    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    // If quantity becomes 0 or less, remove the item
    if (item.quantity + delta <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const prevItems = [...cartItems];

    // Optimistic update
    const updatedItems = cartItems.map((i) =>
      i.id === itemId ? { ...i, quantity: i.quantity + delta } : i
    );
    setCartItems(updatedItems);
    setCartTotal(updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0));

    try {
      const res = await axiosInstance.post("/cart/update", { itemId, delta });

      if (res.data?.success) {
        await fetchCart(); // Sync with backend
      } else {
        throw new Error(res.data?.message || "Could not update quantity.");
      }
    } catch (err: any) {
      // Rollback on error
      setCartItems(prevItems);
      setCartTotal(prevItems.reduce((acc, i) => acc + i.price * i.quantity, 0));
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ---------------- HOOK ----------------
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart must be used within a CartProvider");
  return context;
};