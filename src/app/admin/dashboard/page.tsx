"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ 1. useRouter import kiya
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import StatsCard from "../../../../components/dashboard/StatsCard";
import SalesChart from "../../../../components/dashboard/SalesChart";
import RecentOrders from "../../../../components/dashboard/RecentOrders";
import NewCustomers from "../../../../components/dashboard/NewCustomers";
import { DollarSign, ShoppingBag, Users, Activity, Calendar } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../../../context/AuthContext";

import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter(); // ✅ 2. Router initialize kiya

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    conversionRate: 3.42 // Default static value for now
  });
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // 1. Agar auth load ho raha hai, toh bas wait karein (bahar nikal jayein)
    if (authLoading) {
      setLoading(true);
      return; 
    }

    // 2. Agar load hone ke baad user authenticated nahi hai, toh error/redirect handle karein
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    // 3. Agar authLoading false hai aur user authenticated hai, tab data mangwayein
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard/stats");
        if (response.data.success) {
          setStats(prev => ({
            ...prev,
            revenue: response.data.data.revenue,
            orders: response.data.data.orders,
            users: response.data.data.users
          }));
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false); // Data aane ke baad loading false karein
      }
    };

    fetchStats();
    
  // 👇 SABSE ZAROORI LINE: Yahan dependencies add karni hain
  }, [authLoading, isAuthenticated]);

  const today = new Date().toLocaleDateString('en-US', { 
    month: 'long', day: 'numeric', year: 'numeric' 
  });

  return (
    <DashboardLayout>
      {/* 1. Welcome Header Section */}
      <div className={styles.pageHeader}>
        <div className={styles.welcomeText}>
          <h1>Welcome back, Admin 👋</h1>
          <p>Here's what's happening with your store today.</p>
        </div>
        <div className={styles.datePicker}>
          <Calendar size={18} />
          <span>{today}</span>
        </div>
      </div>

      {/* 2. Optimized Stats Grid */}
      <div className={styles.statsGrid}>
        <StatsCard
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          change="+12.5%"
          isUp={true}
          icon={<DollarSign size={20} />}
          color="#0f5132"
        />
        <StatsCard
          title="Total Orders"
          value={stats.orders.toLocaleString()}
          change="+8.2%"
          isUp={true}
          icon={<ShoppingBag size={20} />}
          color="#3b82f6"
        />
        <StatsCard
          title="Total Customers"
          value={stats.users.toLocaleString()}
          change="+5.1%"
          isUp={true}
          icon={<Users size={20} />}
          color="#8b5cf6"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change="-1.2%"
          isUp={false}
          icon={<Activity size={20} />}
          color="#f59e0b"
        />
      </div>

      {/* 3. Main Chart Section */}
      <div className={styles.chartContainer}>
        <div className={styles.cardHeader}>
          <h3>Sales Overview</h3>
        </div>
        <SalesChart />
      </div>

      {/* 4. Bottom Grid: Orders & Customers */}
      <div className={styles.bottomGrid}>
        <div className={styles.recentOrdersWrapper}>
          <div className={styles.cardHeader}>
            <h3>Recent Orders</h3>
            {/* ✅ 3. Yahan onClick function laga diya */}
            <button 
              className={styles.viewAllBtn} 
              onClick={() => router.push("/admin/orders")}
            >
              View All
            </button>
          </div>
          <RecentOrders />
        </div>
        
        <div className={styles.newCustomersWrapper}>
          <div className={styles.cardHeader}>
            <h3>New Customers</h3>
          </div>
          <NewCustomers />
        </div>
      </div>
    </DashboardLayout>
  );
}