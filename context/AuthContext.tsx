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
  phone?: string; // regular users ke liye
  role?: 'user' | 'admin' | 'owner'; // regular users ke liye optional
  isAdminApproved?: boolean;         // regular users ke liye optional
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUserStatus: () => Promise<void>; // Status check karne ke liye naya function
  updateUser: (newUserData: Partial<User>) => void; // Function to update user data
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
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const updateUser = useCallback((newUserData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null; // Should not happen for a logged-in user
      const updatedUser = { ...prevUser, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  }, [router]);

  // Naya function: Backend se latest status mangwane ke liye
  const refreshUserStatus = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/auth/me'); // Maan lijiye aapka profile route hai
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Status refresh failed");
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
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