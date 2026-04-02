"use client";

import { useState, useEffect } from "react";
import { Mail, ChevronRight } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import styles from "./NewCustomers.module.css";

export default function NewCustomers() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Agar auth state check ho raha hai, toh wait karein
    if (authLoading) {
      setLoading(true);
      return;
    }

    // 2. Agar user login nahi hai, toh API call mat karein
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchNewCustomers = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard/new-customers");
        if (response.data.success) {
          setCustomers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching new customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewCustomers();
    
  // 👇 FIX: Dependency array updated
  }, [authLoading, isAuthenticated]);

  if (loading) {
    return <div className={styles.wrapper}>Loading customers...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {customers.map((c: any, index: number) => (
          <div key={index} className={styles.customerRow}>
            <div className={styles.infoGroup}>
              <div className={styles.avatarWrapper}>
                <img 
                  src={`https://i.pravatar.cc/100?u=${c.email}`} 
                  alt={c.name}
                  className={styles.avatar} 
                />
                <span className={styles.onlineStatus}></span>
              </div>
              <div className={styles.details}>
                <p className={styles.name}>{c.name}</p>
                <span className={styles.email}>{c.email}</span>
              </div>
            </div>
            
            <a href={`mailto:${c.email}`} className={styles.actionBtn} title="Send Email">
              <Mail size={16} />
            </a>
          </div>
        ))}
      </div>
      
      <button className={styles.footerLink}>
        See all customers <ChevronRight size={14} />
      </button>
    </div>
  );
}