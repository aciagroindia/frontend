"use client";

import { useState, useEffect } from "react";
import { Package, UserPlus, AlertTriangle, Check, X } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./Notifications.module.css";
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";

type Notification = {
  _id: string;
  type: "order" | "user" | "alert";
  text: string;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/admin/notifications");
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClearNotification = async (id: string) => {
    try {
      await axiosInstance.put(`/admin/notifications/${id}/clear`);
      setNotifications((current) => current.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to clear notification:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await axiosInstance.put("/admin/notifications/clear-all");
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order": return <Package size={16} />;
      case "user": return <UserPlus size={16} />;
      case "alert": return <AlertTriangle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "order": return "#3b82f6";
      case "user": return "#10b981";
      case "alert": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " seconds ago";
  };

  if (loading) {
    return <DashboardLayout><div className={styles.container}>Loading notifications...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
    <div className={`${styles.container} adjustTop`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>

        {notifications.length > 0 && (
          <button className={styles.clearAllButton} onClick={handleClearAll}>
            Clear All
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <ul className={styles.list}>
          {notifications.map((item) => {
            const color = getColor(item.type);
            return (
              <li key={item._id} className={styles.item}>
                <div
                  className={styles.iconWrapper}
                  style={{
                    backgroundColor: `${color}20`,
                    color: color,
                  }}
                >
                  {getIcon(item.type)}
                </div>

                <div className={styles.content}>
                  <p className={styles.message}>{item.text}</p>
                  <p className={styles.timestamp}>{getTimeAgo(item.createdAt)}</p>
                </div>

                <button
                  className={styles.removeButton}
                  onClick={() => handleClearNotification(item._id)}
                  aria-label="Remove notification"
                >
                  <X size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <Check size={24} />
          </div>

          <h3 className={styles.emptyStateTitle}>All Caught Up!</h3>
          <p className={styles.emptyStateText}>
            You have no new notifications.
          </p>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}
