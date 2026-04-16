"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';

// Backend se aane wala Product ka structure
export interface Product {
  _id: string;
  id: string; // _id ka alias
  name: string;
  slug: string;
  description: string;
  price: number;
  category: { _id: string; name: string; }; // Populated category
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

// Context ka type
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

// Data ko frontend ke liye normalize karne ka function
const normalizeProduct = (product: any): Product => {
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
    stock: Number(product.stock) || 0,
  };
};

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedProduct, setLastUpdatedProduct] = useState<Product | null>(null);

  // UPDATE CACHE HELPERS (Local Memory ke liye)
  const syncProductsCache = (data: Product[]) => {
    if (typeof window !== 'undefined') localStorage.setItem('products_cache', JSON.stringify(data));
  };
  const syncBestSellersCache = (data: Product[]) => {
    if (typeof window !== 'undefined') localStorage.setItem('bestsellers_cache', JSON.stringify(data));
  };

  // Saare products fetch karein
  const fetchProducts = useCallback(async (status?: string) => {
    try {
      const url = status ? `/products?status=${status}` : '/products';
      const response = await axiosInstance.get(url);
      const freshProducts = response.data?.map(normalizeProduct) || [];
      
      setProducts(freshProducts);
      // Agar normally fetch ho raha hai (bina status filter ke), tabhi cache karo
      if (!status) syncProductsCache(freshProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      if (products.length === 0) toast.error("Products load nahi ho paaye.");
    }
  }, [products.length]);

  // Best-selling products fetch karein
  const fetchBestSellers = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/products/best-sellers');
      if (response.data.success) {
        const freshBestSellers = response.data.products?.map(normalizeProduct) || [];
        setBestSellers(freshBestSellers);
        syncBestSellersCache(freshBestSellers);
      }
    } catch (error) {
      console.error("Failed to fetch best sellers:", error);
      if (bestSellers.length === 0) toast.error("Best sellers load nahi ho paaye.");
    }
  }, [bestSellers.length]);

  // Shuruaat me data fetch karein
  useEffect(() => {
    // 1. INSTANT LOAD: Pehle browser ki memory se turant dikhao
    let hasCache = false;
    if (typeof window !== 'undefined') {
      const cachedProducts = localStorage.getItem('products_cache');
      const cachedBestSellers = localStorage.getItem('bestsellers_cache');
      
      if (cachedProducts) {
        try { setProducts(JSON.parse(cachedProducts)); hasCache = true; } catch (e) {}
      }
      if (cachedBestSellers) {
        try { setBestSellers(JSON.parse(cachedBestSellers)); hasCache = true; } catch (e) {}
      }
      
      // Agar cache mil gaya, toh UI ko wait mat karwao
      if (hasCache) setLoading(false);
    }

    // 2. BACKGROUND FETCH LOGIC (Optimized)
    const fetchInitialData = async () => {
      // Agar cache nahi hai, tabhi loading true dikhao
      if (!hasCache) setLoading(true);

      // Pehle sirf BestSellers fetch karo kyuki home page par yahi chahiye
      await fetchBestSellers();

      // Bestsellers aate hi loading false kar do, taaki website block na ho
      if (!hasCache) setLoading(false);

      // Baaki products background me fetch karo (halki si delay ke sath taaki network choke na ho)
      setTimeout(() => {
        fetchProducts();
      }, 1000); // 1 second ka delay
    };
    
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Eslint ignore is safe here

  // Ek product slug se fetch karein
  const fetchProductBySlug = useCallback(async (slug: string): Promise<Product | null> => {
    try {
      const response = await axiosInstance.get(`/products/${slug}`);
      return normalizeProduct(response.data);
    } catch (error) {
      console.error(`Failed to fetch product with slug ${slug}:`, error);
      toast.error("Product details load nahi ho paaye.");
      return null;
    }
  }, []);

  // Related products fetch karein
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

  // Naya product add karein
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
          syncProductsCache(updated); // ⚡ Cache me turant update
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

  // Product update karein
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
          syncProductsCache(updated); // ⚡ Cache update
          return updated;
        });
        setBestSellers((prev) => {
          const updated = prev.map((p) => (p._id === id ? updatedProduct : p));
          syncBestSellersCache(updated); // ⚡ Cache update
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

  // Product delete karein
  const deleteProduct = useCallback(async (id:string): Promise<boolean> => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      if (response.data && response.data.message) {
        toast.success('Product safaltapoorvak delete ho gaya!');
        
        setProducts((prev) => {
          const updated = prev.filter((p) => p._id !== id);
          syncProductsCache(updated); // ⚡ Cache update
          return updated;
        });
        setBestSellers((prev) => {
          const updated = prev.filter((p) => p._id !== id);
          syncBestSellersCache(updated); // ⚡ Cache update
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

  const value = { products, bestSellers, relatedProducts, loading, lastUpdatedProduct, fetchProducts, fetchBestSellers, fetchProductBySlug, fetchRelatedProducts, addProduct, updateProduct, deleteProduct };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

// Custom hook
export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}