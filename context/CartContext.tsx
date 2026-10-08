"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
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
  const { isAuthenticated, openLoginModal } = useAuth();

  // ---------------- NORMALIZE ----------------
  const normalizeCartItems = (items: any[]): CartItem[] => {
    if (!Array.isArray(items)) return [];
    return items.map((item: any) => {
      const prod = item.product || {};
      const img =
        (Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : null) ||
        prod.image ||
        item.image ||
        (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null) ||
        "";

      return {
        id: item._id,
        productId: prod._id || item.product || item.productId,
        name: prod.name || item.name || "Product",
        price: Number(item.price) || Number(prod.price) || 0,
        quantity: Number(item.quantity) || 0,
        image: img,
        stock: Number(prod.stock) || 0,
        slug: prod.slug || item.slug || "",
        variant: item.variant || "",
      };
    });
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
  const addToCart = useCallback(async (
    product: any,
    quantity = 1,
    silent = false
  ) => {
    if (!isAuthenticated) {
      openLoginModal(async () => {
        try {
          const rawId = product._id || product.productId || product.id;
          const baseProductId = typeof rawId === "string" && rawId.includes("-") ? rawId.split("-")[0] : rawId;
          const variant = (product.variant || product.unit || "").trim();
          const price = Number(product.price) || 0;
          const packageId = product.packageId || (typeof rawId === "string" && rawId.includes("-") ? rawId.split("-")[1] : undefined);

          await axiosInstance.post("/cart", {
            productId: baseProductId,
            packageId: packageId || undefined,
            variant: variant || undefined,
            quantity,
            price: price > 0 ? price : undefined,
          });

          await fetchCart();
          setIsCartOpen(true);
          toast.success("Added to cart!");
        } catch (e) {
          console.error("Post-login addToCart error:", e);
        }
      });
      return;
    }

    const isOutOfStock = Boolean(
      product.status === "Inactive" ||
      (product.stock !== undefined && Number(product.stock) <= 0)
    );
    if (isOutOfStock) {
      if (!silent) toast.error("This product is currently out of stock.");
      return;
    }

    const rawId = product._id || product.productId || product.id;
    const baseProductId = typeof rawId === "string" && rawId.includes("-") ? rawId.split("-")[0] : rawId;
    const variant = (product.variant || product.unit || "").trim();
    const price = Number(product.price) || 0;
    const packageId = product.packageId || (typeof rawId === "string" && rawId.includes("-") ? rawId.split("-")[1] : undefined);

    let prevItems: CartItem[] = [];
    let prevTotal = 0;

    setCartItems((currItems) => {
      prevItems = [...currItems];
      const existingItemIndex = currItems.findIndex(
        (i) => i.productId === baseProductId && (i.variant || "").trim() === variant
      );
      let updatedItems = [...currItems];

      if (existingItemIndex > -1) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
      } else {
        updatedItems.push({
          id: "temp-" + Date.now(),
          productId: baseProductId,
          name: product.name,
          price: price,
          quantity: quantity,
          image: product.image || (product.images && product.images[0]) || "",
          stock: product.stock || 10,
          slug: product.slug,
          variant: variant,
        });
      }
      return updatedItems;
    });

    setCartTotal((currTotal) => {
      prevTotal = currTotal;
      return currTotal + price * quantity;
    });

    if (!silent) {
      toast.success("Added to cart!");
      setIsCartOpen(true);
    }

    try {
      const response = await axiosInstance.post("/cart/add", {
        productId: baseProductId,
        quantity,
        variant,
        price,
        packageId,
      });

      if (response.data.success) {
        fetchCart();
      } else {
        throw new Error("Failed to add");
      }
    } catch (err: any) {
      setCartItems(prevItems);
      setCartTotal(prevTotal);
      if (!silent) {
        toast.error(err.response?.data?.message || "Error adding to cart.");
      }
    }
  }, [isAuthenticated, fetchCart]);

  // ---------------- REMOVE ----------------
  const removeFromCart = useCallback(async (itemId: string) => {
    if (!isAuthenticated) return;

    let prevItems: CartItem[] = [];
    let prevTotal = 0;

    setCartItems((curr) => {
      prevItems = curr;
      return curr.filter((item) => item.id !== itemId);
    });

    setCartTotal((curr) => {
      prevTotal = curr;
      const item = prevItems.find((i) => i.id === itemId);
      return item ? curr - item.price * item.quantity : curr;
    });

    try {
      const res = await axiosInstance.delete(`/cart/remove/${itemId}`);

      if (res.data?.success) {
        toast.success("Item removed from cart.");
        await fetchCart();
      } else {
        throw new Error(res.data?.message || "Could not remove item.");
      }
    } catch (err: any) {
      setCartItems(prevItems);
      setCartTotal(prevTotal);
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  }, [isAuthenticated, fetchCart]);

  // ---------------- UPDATE QUANTITY ----------------
  const updateQuantity = useCallback(async (itemId: string, delta: number) => {
    if (!isAuthenticated) return;

    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    if (item.quantity + delta <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const prevItems = [...cartItems];
    const prevTotal = cartTotal;

    const updatedItems = cartItems.map((i) =>
      i.id === itemId ? { ...i, quantity: i.quantity + delta } : i
    );
    setCartItems(updatedItems);
    setCartTotal(updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0));

    try {
      const res = await axiosInstance.post("/cart/update", { itemId, delta });

      if (res.data?.success) {
        await fetchCart();
      } else {
        throw new Error(res.data?.message || "Could not update quantity.");
      }
    } catch (err: any) {
      setCartItems(prevItems);
      setCartTotal(prevTotal);
      toast.error(err.response?.data?.message || "Update failed");
    }
  }, [isAuthenticated, cartItems, cartTotal, fetchCart, removeFromCart]);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      isCartOpen,
      setIsCartOpen,
      cartTotal,
      fetchCart,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      isCartOpen,
      cartTotal,
      fetchCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
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