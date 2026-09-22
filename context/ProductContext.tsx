"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';

export interface Product {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  descriptionSections?: { title: string; content: string }[];
  price: number;
  category: { _id: string; name: string; };
  image: string;
  images?: string[];
  faqs: { question: string; answer: string; }[];
  packages: { 
    name: string; 
    details?: string; 
    price: number; 
    regularPrice?: number; 
    discount?: number; 
    badge?: string; 
  }[];
  unit?: string;
  stock: number;
  status: "Active" | "Inactive";
  rating: number;
  numReviews: number;
  salesCount: number;
}

interface ProductContextType {
  products: Product[];
  bestSellers: Product[];
  relatedProducts: Product[];
  loading: boolean;
  lastUpdatedProduct: Product | null;
  fetchProducts: (status?: string) => Promise<void>;
  fetchBestSellers: () => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<Product | null>;
  fetchRelatedProducts: (slug: string) => Promise<void>;
  addProduct: (data: FormData) => Promise<boolean>;
  updateProduct: (id: string, data: FormData) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const normalizeProduct = (product: any): Product => {
  const allImages = Array.from(
    new Set([product.image, ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean))
  );

  const mainImage = allImages.length > 0 ? allImages[0] : '';
  const galleryImages = allImages.slice(1);

  return {
    ...product,
    _id: product._id,
    id: product._id,
    image: mainImage,      
    images: galleryImages, 
    price: Number(product.price) || 0,
    faqs: Array.isArray(product.faqs) ? product.faqs : [],
    packages: Array.isArray(product.packages) ? product.packages : [],
    descriptionSections: Array.isArray(product.descriptionSections) ? product.descriptionSections : [],
    stock: Number(product.stock) || 0,
  };
};

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdatedProduct, setLastUpdatedProduct] = useState<Product | null>(null);

  const syncProductsCache = (data: Product[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('products_cache', JSON.stringify(data));
      } catch (e) {
        console.warn("Products cache write skipped:", e);
      }
    }
  };
  
  const syncBestSellersCache = (data: Product[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bestsellers_cache', JSON.stringify(data));
      } catch (e) {
        console.warn("Best sellers cache write skipped:", e);
      }
    }
  };

  const fetchProducts = useCallback(async (status?: string) => {
    // 1. Instant load from cache if state is empty
    if (!status && typeof window !== 'undefined' && products.length === 0) {
      try {
        const cached = localStorage.getItem('products_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        }
      } catch (e) {}
    }

    // 2. Fetch fresh products from API
    try {
      setLoading(true);
      const url = status ? `/products?status=${status}` : '/products';
      const response = await axiosInstance.get(url);
      const freshProducts = response.data?.map(normalizeProduct) || [];
      
      setProducts(freshProducts);
      if (!status) syncProductsCache(freshProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [products.length]);

  const fetchBestSellers = useCallback(async () => {
    // 1. Instant load from cache if state is empty
    if (typeof window !== 'undefined' && bestSellers.length === 0) {
      try {
        const cached = localStorage.getItem('bestsellers_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBestSellers(parsed);
          }
        }
      } catch (e) {}
    }

    // 2. Fetch fresh bestsellers from API
    try {
      const response = await axiosInstance.get('/products/best-sellers');
      if (response.data.success) {
        const freshBestSellers = response.data.products?.map(normalizeProduct) || [];
        setBestSellers(freshBestSellers);
        syncBestSellersCache(freshBestSellers);
      }
    } catch (error) {
      console.error("Failed to fetch best sellers:", error);
    }
  }, [bestSellers.length]);

  const fetchProductBySlug = useCallback(async (slug: string): Promise<Product | null> => {
    try {
      const response = await axiosInstance.get(`/products/${slug}`);
      return normalizeProduct(response.data);
    } catch (error) {
      console.error(`Failed to fetch product with slug ${slug}:`, error);
      return null;
    }
  }, []);

  const fetchRelatedProducts = useCallback(async (slug: string) => {
    try {
      const response = await axiosInstance.get(`/products/related/${slug}`);
      if (response.data.success) {
        setRelatedProducts(response.data.products?.map(normalizeProduct) || []);
      }
    } catch (error) {
      console.error(`Failed to fetch related products for slug ${slug}:`, error);
    }
  }, []);

  const addProduct = useCallback(async (formData: FormData): Promise<boolean> => {
    try {
      const response = await axiosInstance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data && response.data._id) {
        toast.success('Product safaltapoorvak jod diya gaya!');
        const newProduct = normalizeProduct(response.data);
        
        setProducts((prev) => {
          const updated = [newProduct, ...prev];
          syncProductsCache(updated);
          return updated;
        });
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Product jodne mein samasya aayi.');
      return false;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, formData: FormData): Promise<boolean> => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data && response.data._id) {
        toast.success('Product safaltapoorvak update ho gaya!');
        const updatedProduct = normalizeProduct(response.data);
        
        setProducts((prev) => {
          const updated = prev.map((p) => (p._id === id ? updatedProduct : p));
          syncProductsCache(updated);
          return updated;
        });
        setBestSellers((prev) => {
          const updated = prev.map((p) => (p._id === id ? updatedProduct : p));
          syncBestSellersCache(updated);
          return updated;
        });
        
        setRelatedProducts((prev) => prev.map((p) => (p._id === id ? updatedProduct : p)));
        setLastUpdatedProduct(updatedProduct);
        return true;
      }
      toast.error(response.data.message || 'Product update karne mein samasya aayi.');
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Product update karne mein samasya aayi.');
      return false;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      if (response.data && response.data.message) {
        toast.success('Product safaltapoorvak delete ho gaya!');
        
        setProducts((prev) => {
          const updated = prev.filter((p) => p._id !== id);
          syncProductsCache(updated);
          return updated;
        });
        setBestSellers((prev) => {
          const updated = prev.filter((p) => p._id !== id);
          syncBestSellersCache(updated);
          return updated;
        });
        
        return true;
      }
      toast.error(response.data.message || 'Product delete karne mein samasya aayi.');
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Product delete karne mein samasya aayi.');
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      products,
      bestSellers,
      relatedProducts,
      loading,
      lastUpdatedProduct,
      fetchProducts,
      fetchBestSellers,
      fetchProductBySlug,
      fetchRelatedProducts,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      products,
      bestSellers,
      relatedProducts,
      loading,
      lastUpdatedProduct,
      fetchProducts,
      fetchBestSellers,
      fetchProductBySlug,
      fetchRelatedProducts,
      addProduct,
      updateProduct,
      deleteProduct,
    ]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}