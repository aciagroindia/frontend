"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
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
  const [loading, setLoading] = useState<boolean>(true);

  const normalizeCategory = (category: any): Category => ({
    ...category,
    id: category._id,
  });

  const syncCache = (data: Category[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('categories_cache', JSON.stringify(data));
      } catch (e) {
        console.warn("Categories cache write skipped:", e);
      }
    }
  };

  const fetchCategories = useCallback(async () => {
    // 1. INSTANT LOAD FROM CACHE IF AVAILABLE
    if (typeof window !== 'undefined') {
      const cachedData = localStorage.getItem('categories_cache');
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
            setLoading(false);
          }
        } catch (e) {
          console.error("Cache parse error", e);
        }
      }
    }

    // 2. FETCH FROM API
    try {
      const response = await axiosInstance.get('/categories');
      if (response.data.success) {
        const freshCategories = response.data.data?.map(normalizeCategory) || [];
        setCategories(freshCategories);
        syncCache(freshCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchCategories();
    return () => {
      isMounted = false;
    };
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
          syncCache(updated);
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
    try {
      const response = await axiosInstance.put(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.success) {
        const updatedCategory = normalizeCategory(response.data.data);
  
        setCategories(prev => {
          const updatedList = prev.map(cat => cat._id === id ? updatedCategory : cat);
          syncCache(updatedList);
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
          syncCache(updatedList);
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

  const value = useMemo(
    () => ({ categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory }),
    [categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory]
  );

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) throw new Error('useCategories must be used within a CategoryProvider');
  return context;
}