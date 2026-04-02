"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import styles from "./RecentOrders.module.css";

export default function RecentOrders() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    const fetchRecentOrders = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard/recent-orders");

        if (response.data?.success) {
          const formattedOrders = response.data.data.map((o: any) => ({
            id: o.id,
            customer: o.customerName,
            date: o.date,
            total: o.total,
            status: o.status,
          }));
          setOrders(formattedOrders);
        }
      } catch (err: any) {
        console.error("Error fetching recent orders:", err?.response?.data || err.message);
        setError(
          err?.response?.data?.message ||
          "Could not fetch recent orders. Server error."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
    
  // 👇 FIX: Dependency array updated
  }, [authLoading, isAuthenticated]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className={styles.container}>Loading orders...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th className={styles.actionCol}>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o: any, index: number) => (
              <tr key={o.id ?? `order-${index}`} className={styles.row}>
                <td className={styles.orderId}>
                  #{o.id?.toString().slice(-6).toUpperCase()}
                </td>

                <td className={styles.customerName}>
                  {o.customer}
                </td>

                <td className={styles.date}>
                  {formatDate(o.date)}
                </td>

                <td className={styles.total}>
                  ₹{o.total?.toLocaleString()}
                </td>

                <td>
                  <span className={`${styles.badge} ${styles[o.status?.toLowerCase()] || styles.pending}`}>
                    <span className={styles.dot}></span>
                    {o.status}
                  </span>
                </td>

                <td className={styles.actionCol}>
                  <button className={styles.viewBtn}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}