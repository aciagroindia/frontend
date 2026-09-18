"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";

interface Product {
  id: string; // Map _id to id for frontend
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface WishlistContextType {
  wishlist: Product[];
  loading: boolean;
  toggleWishlist: (product: any) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) {
       setWishlist([]);
       return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get("/wishlist");
      if (response.data.success) {
        const products = response.data.data.products.map((p: any) => ({
          ...p,
          id: p._id, 
          image: p.image || (p.images && p.images[0]) || "",
        }));
        setWishlist(products);
      }
    } catch (error) {
      console.error("Wishlist fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // ---------------- TOGGLE WISHLIST (⚡ OPTIMISTIC FAST) ----------------
  const toggleWishlist = useCallback(async (product: any) => {
    const token = getToken();
    if (!token) {
        toast.error("Please login to manage your wishlist.");
        return;
    }

    const productId = product._id || product.id;
    let prevWishlist: Product[] = [];
    let isCurrentlyInWishlist = false;

    setWishlist((current) => {
      prevWishlist = current;
      isCurrentlyInWishlist = current.some((item) => item.id === productId);
      if (isCurrentlyInWishlist) {
        return current.filter((item) => item.id !== productId);
      } else {
        return [
          ...current,
          {
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image || (product.images && product.images[0]) || "",
            slug: product.slug,
          },
        ];
      }
    });

    if (isCurrentlyInWishlist) {
      toast.success("Removed from wishlist!");
    } else {
      toast.success("Added to wishlist!");
    }

    // Background Database Call
    try {
      const response = await axiosInstance.post("/wishlist/toggle", { productId });
      
      if (!response.data.success) {
        throw new Error("Failed to toggle server state");
      }
    } catch (error: any) {
      console.error("Toggle wishlist error:", error);
      setWishlist(prevWishlist);
      toast.error(error.response?.data?.message || "Action failed. Refreshing data.");
    }
  }, []);

  const isInWishlist = useCallback((id: string) => {
    return wishlist.some((item) => item.id === id);
  }, [wishlist]);

  const value = useMemo(
    () => ({
      wishlist,
      loading,
      toggleWishlist,
      isInWishlist,
      fetchWishlist,
    }),
    [wishlist, loading, toggleWishlist, isInWishlist, fetchWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};