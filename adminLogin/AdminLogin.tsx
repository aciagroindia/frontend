"use client";

import { useState } from 'react';
import styles from './AdminLogin.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext'; // Context use kiya
import axiosInstance from '@/utils/axiosInstance'; // API call ke liye
import { toast } from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Backend API hit karein
      const response = await axiosInstance.post('/auth/login', { email, password });

      if (response.data.success) {
        const { token, user } = response.data.data;

        // 2. AuthContext mein data save karein
        login(token, user);

        toast.success(`Welcome back, ${user.name}!`);

        // 3. Smart Redirect Logic
        if (user.role === 'owner') {
          router.push('/admin/dashboard'); // Owner seedha dashboard par
        } else if (user.role === 'admin') {
          if (user.isAdminApproved) {
            router.push('/admin/dashboard'); // Approved Admin
          } else {
            router.push('/admin/waiting'); // Pending Admin
          }
        } else {
          router.push('/'); // Normal user ko home par bhej do
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Manage your store efficiently</p>
        
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              disabled={loading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>

        <p className={styles.footerText}>
          Don't have admin access? <span onClick={() => router.push('/admin/request-access')} style={{cursor: 'pointer', color: '#10b981'}}>Request Here</span>
        </p>
      </div>
    </div>
  );
}