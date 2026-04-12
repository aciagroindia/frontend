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

  // ---------------- ADD TO CART (⚡ OPTIMISTIC FAST) ----------------
  const addToCart = async (
    product: any,
    quantity = 1,
    silent = false
  ) => {
    if (!isAuthenticated) {
      if (!silent) toast.error("Please log in first.");
      return;
    }

    // 1. Current state save karo (agar api fail hui toh wapas yehi set karenge)
    const prevItems = [...cartItems];
    const prevTotal = cartTotal;
    const productId = product._id || product.id;

    // 2. Instant UI Update (Server ka wait kiye bina)
    const existingItemIndex = prevItems.findIndex(i => i.productId === productId);
    let updatedItems = [...prevItems];

    if (existingItemIndex > -1) {
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      updatedItems.push({
        id: "temp-" + Date.now(), // Fake ID for immediate render
        productId: productId,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image || (product.images && product.images[0]) || "",
        stock: product.stock || 10,
        slug: product.slug,
        variant: product.variant || ""
      });
    }

    setCartItems(updatedItems);
    setCartTotal(updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0));

    if (!silent) {
      toast.success("Added to cart!");
      setIsCartOpen(true); // Drawer turant open ho jayega
    }

    // 3. Background me actual API Call
    try {
      const response = await axiosInstance.post("/cart/add", {
        productId,
        quantity,
      });

      if (response.data.success) {
        fetchCart(); // Chupchaap background me real ID ke sath sync kar lo
      } else {
        throw new Error("Failed to add");
      }
    } catch (err: any) {
      // 4. API Fail hui toh Rollback kardo
      setCartItems(prevItems);
      setCartTotal(prevTotal);
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart must be used within a CartProvider");
  return context;
};