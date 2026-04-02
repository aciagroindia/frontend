"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast"; // react-hot-toast ko import karein
import { useRouter } from "next/navigation"; 
import axiosInstance from "@/utils/axiosInstance"; 
import { useAuth } from "../../context/AuthContext"; // 1. AuthContext se useAuth hook import karein
import styles from "./login.module.css"

export default function Login() {
  const router = useRouter();
  const { login } = useAuth(); // 2. Context se login function nikalein
  
  // 1. States - Ab hum 'phone' use kar rahe hain
  const [formData, setFormData] = useState({
    phone: "", 
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Login Submit Function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.phone.trim()) {
      toast.error("Mobile Number is required.");
      setLoading(false);
      return;
    }
    if (!formData.password) {
      toast.error("Password is required.");
      setLoading(false);
      return;
    }

    try {
      // FIX: Backend ab 'phone' expect kar raha hai
      const response = await axiosInstance.post("/auth/login", {
        phone: formData.phone, 
        password: formData.password
      });

      // Check for success and presence of token for robustness
      if (response.data?.success && response.data?.data?.token) {
        // 3. Context ke function se state aur localStorage update karein
        login(response.data.data.token, response.data.data.user);
        toast.success("Login Successful!"); // Alert ko toast se replace kiya
        router.push("/"); // Redirect to Home
      } else {
        toast.error(response.data?.message || "Login failed. Please check your credentials."); // Error ko toast se dikhaya
      }
    } catch (err: any) {
      // Backend se aane wala error message dikhayega
      toast.error(err.response?.data?.message || "Invalid credentials"); // Error ko toast se dikhaya
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Login to access your account</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Mobile Number</label>
            <input
              type="tel"
              name="phone" // FIX: Name 'phone' hona chahiye taaki handleChange sahi chale
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your Mobile Number"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account?{" "}
          <Link href="/signup" className={styles.link}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}