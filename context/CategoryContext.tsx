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

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data?.map(normalizeCategory) || []);
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

const addCategory = useCallback(async (formData: FormData): Promise<boolean> => {
    try {
      const response = await axiosInstance.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.success) {
        const newCategory = normalizeCategory(response.data.data);
        setCategories(prev => [newCategory, ...prev]);
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
    // For debugging: Check the ID being passed in the browser's developer console.
    console.log('Attempting to update category with ID:', id); 
    try {
      const response = await axiosInstance.put(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.success) {
        const updated = normalizeCategory(response.data.data);
  
        setCategories(prev =>
          prev.map(cat => cat._id === id ? updated : cat)
        );
  
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
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
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