"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import { Send, ArrowLeft, ShieldCheck } from "lucide-react";

export default function RequestAccessPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend ko ab Name, Email, aur Password teeno bheje ja rahe hain
      const response = await axiosInstance.post("/admin/auth/request-access", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Request sent successfully! Check your email.");
        setTimeout(() => router.push("/admin/login"), 2000);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.requestBox}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <ArrowLeft size={18} /> Back to Login
        </button>

        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <ShieldCheck size={32} color="#10b981" />
          </div>
          <h1 className={styles.title}>Request Admin Access</h1>
          <p className={styles.subtitle}>
            Enter your credentials to notify the owner
          </p>
        </div>

        <form onSubmit={handleRequest} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              "Sending Request..."
            ) : (
              <>
                Submit Request <Send size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.infoBox}>
          <p>
            Note: Owner will review your request and approve it via email. This
            may take some time.
          </p>
        </div>
      </div>
    </div>
  );
}