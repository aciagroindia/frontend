"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';

export interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  status: "Active" | "Inactive";
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (formData: FormData) => Promise<boolean>;
  updateCategory: (id: string, formData: FormData) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeCategory = (category: any): Category => ({
    ...category,
    id: category._id,
  });

  // 👇 1. UPDATE CACHE HELPER (Background sync ke liye)
  const syncCache = (data: Category[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('categories_cache', JSON.stringify(data));
    }
  };

  const fetchCategories = useCallback(async () => {
    // 👇 2. INSTANT LOAD: Pehle cache se data uthao aur turant dikha do
    if (typeof window !== 'undefined') {
      const cachedData = localStorage.getItem('categories_cache');
      if (cachedData) {
        try {
          setCategories(JSON.parse(cachedData));
          setLoading(false); // Cache milte hi UI turant load ho jayega!
        } catch (e) {
          console.error("Cache parse error", e);
        }
      }
    }

    // Agar cache nahi hai, tabhi spinner dikhega
    setLoading((prev) => categories.length === 0 ? true : prev);

    // 👇 3. BACKGROUND FETCH: Chup-chaap API se naya data check karo
    try {
      const response = await axiosInstance.get('/categories');
      if (response.data.success) {
        const freshCategories = response.data.data?.map(normalizeCategory) || [];
        setCategories(freshCategories);
        syncCache(freshCategories); // Naye data ko agli baar ke liye save kar lo
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Galti se cache bhi na ho aur error aa jaye, tabhi toast dikhana
      if (categories.length === 0) {
        toast.error("Categories load nahi ho paayin.");
      }
    } finally {
      setLoading(false);
    }
  }, [categories.length]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = useCallback(async (formData: FormData): Promise<boolean> => {
    try {
      const response = await axiosInstance.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.success) {
        const newCategory = normalizeCategory(response.data.data);
        setCategories(prev => {
          const updated = [newCategory, ...prev];
          syncCache(updated); // ⚡ Cache me bhi turant update
          return updated;
        });
        toast.success('Category successfully added!');
        return true;
      }
  
      toast.error(response.data.message || 'Error adding category');
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error adding category');
      return false;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, formData: FormData): Promise<boolean> => {
    if (!id) {
      toast.error("Category ID is missing. Cannot update.");
      return false;
    }
    console.log('Attempting to update category with ID:', id); 
    try {
      const response = await axiosInstance.put(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.success) {
        const updatedCategory = normalizeCategory(response.data.data);
  
        setCategories(prev => {
          const updatedList = prev.map(cat => cat._id === id ? updatedCategory : cat);
          syncCache(updatedList); // ⚡ Cache me bhi turant update
          return updatedList;
        });
  
        toast.success('Category successfully updated!');
        return true;
      }
      
      toast.error(response.data.message || 'Error updating category');
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error updating category');
      return false;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    if (!id) {
      toast.error("Category ID is missing. Cannot delete.");
      return false;
    }
    try {
      const response = await axiosInstance.delete(`/categories/${id}`);
      if (response.data.success) {
        toast.success('Category deleted!');
        setCategories((prev) => {
          const updatedList = prev.filter((cat) => cat._id !== id);
          syncCache(updatedList); // ⚡ Cache me bhi turant delete
          return updatedList;
        });
        return true;
      }
      toast.error(response.data.message || 'Error deleting category');
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error deleting category');
      return false;
    }
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) throw new Error('useCategories must be used within a CategoryProvider');
  return context;
}