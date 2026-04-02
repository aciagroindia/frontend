"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';

// Category ka structure
export interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  image: string; // Image ka URL
}

// Add/Update ke liye FormData ka structure
export interface CategoryFormData {
  name: string;
  image?: File; // Update ke waqt image optional hai
}

// Context ka type
interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (data: CategoryFormData) => Promise<boolean>;
  updateCategory: (id: string, data: CategoryFormData) => Promise<boolean>;
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

  // Saari categories fetch karne ka function
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data.map(normalizeCategory));
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Categories load nahi ho paayin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Function to add a new category (image ke saath)
  const addCategory = async (data: CategoryFormData): Promise<boolean> => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image) {
      formData.append('image', data.image);
    }

    try {
      const response = await axiosInstance.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        toast.success('Category safaltapoorvak jod di gayi!');
        await fetchCategories(); // List ko refresh karein
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Category jodne mein samasya aayi.');
      return false;
    }
  };

  // Function to update a category
  const updateCategory = async (id: string, data: CategoryFormData): Promise<boolean> => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image) {
      formData.append('image', data.image);
    }

    try {
      await axiosInstance.put(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Category safaltapoorvak update ho gayi!');
      await fetchCategories(); // List ko refresh karein
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Category update karne mein samasya aayi.');
      return false;
    }
  };

  // Function to delete a category
  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
      toast.success('Category safaltapoorvak delete ho gayi!');
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Category delete karne mein samasya aayi.');
      return false;
    }
  };

  const value = { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

// Custom hook
export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}