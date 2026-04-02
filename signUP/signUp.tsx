"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Next.js router import kiya
import styles from "./signUp.module.css";
import { toast } from "react-hot-toast"; // react-hot-toast ko import karein
import axiosInstance from "../../src/utils/axiosInstance"; // Apne path ke hisaab se check karein

export default function SignupPage() {
  const router = useRouter(); // Router ko initialize kiya

  // 1. State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // 2. Handle input changes - Sahi TypeScript types ke saath
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Form Submit function - Sahi TypeScript types ke saath
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name.trim()) {
      toast.error("Full Name is required.");
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email Address is required.");
      setLoading(false);
      return;
    }
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
      const response = await axiosInstance.post("/auth/signup", formData);
      
      // Response successful hai aur token bhi mila hai
      if (response.data && response.data.data?.token) {
        toast.success("Account created successfully!"); // Alert ko toast se replace kiya
        // Token ko localStorage me save kar diya
        localStorage.setItem("token", response.data.data.token);
        // Next.js ke router se redirect karna behtar hai, page refresh nahi hota
        router.push("/login");
      } else {
        toast.error(response.data.message || "An unexpected error occurred."); // Error ko toast se dikhaya
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again."); // Error ko toast se dikhaya
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              name="name" // Backend field match hona chahiye
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email address"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mobile Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your Mobile number"
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
              placeholder="Create a password"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        {/* Footer links... */}
      </div>
    </div>
  );
}