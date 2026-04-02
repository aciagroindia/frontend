"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
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

  // Helper to get token (axios interceptor uses it too)
  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch from backend
  const fetchWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) {
       setWishlist([]); // Clear if no token
       return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get("/wishlist");
      if (response.data.success) {
        // Backend returns { success: true, data: { products: [...] } }
        const products = response.data.data.products.map((p: any) => ({
          ...p,
          id: p._id, // Normalize _id for frontend compatibility
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

  // Sync on mount or token change (login/logout handled by context reset or refresh)
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Toggle backend and update state
  const toggleWishlist = async (product: any) => {
    const token = getToken();
    if (!token) {
        toast.error("Please login to manage your wishlist.");
        return;
    }

    try {
      // Backend: POST /api/wishlist/toggle { productId: "..." }
      const response = await axiosInstance.post("/wishlist/toggle", { productId: product.id || product._id });
      
      if (response.data.success) {
        const isAdded = response.data.data.added;
        
        if (isAdded) {
          toast.success("Added to wishlist!");
          setWishlist(prev => [...prev, { 
            id: product._id || product.id, 
            name: product.name, 
            price: product.price, 
            image: product.image || (product.images && product.images[0]) || "", 
            slug: product.slug 
          }]);
        } else {
          toast.success("Removed from wishlist!");
          setWishlist(prev => prev.filter(item => item.id !== (product._id || product.id)));
        }
      }
    } catch (error: any) {
      console.error("Toggle wishlist error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, toggleWishlist, isInWishlist, fetchWishlist }}
    >
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