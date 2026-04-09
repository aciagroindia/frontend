"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string; 
  role?: 'user' | 'admin' | 'owner'; 
  isAdminApproved?: boolean;         
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUserStatus: () => Promise<void>; 
  updateUser: (newUserData: Partial<User>) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = useCallback((newToken: string, userData: User) => {
    setUser(userData);
    setToken(newToken);
    
    // FIX: Ensure Axios Header gets strictly updated immediately
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const updateUser = useCallback((newUserData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null; 
      const updatedUser = { ...prevUser, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    
    // FIX: Safely remove header
    delete axiosInstance.defaults.headers.common['Authorization'];
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Agar logout hote hain to home page pe jaayein
    router.push('/');
  }, [router]);

  const refreshUserStatus = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/auth/me'); 
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Status refresh failed");
    }
  }, []);

  useEffect(() => {
    // FIX: Page load hote hi turant token ko axios me inject karna zaroori hai
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        // Default Header set in first render
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        login(storedToken, userData);
      } catch (error) {
        console.error("Failed to parse user from localStorage. Logging out.", error);
        logout();
      }
    }
    setLoading(false);
  }, [login, logout]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      loading, 
      login, 
      logout, 
      refreshUserStatus,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}