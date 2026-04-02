"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users } from "lucide-react";
import { Line } from "react-chartjs-2";
import axiosInstance from "@/utils/axiosInstance";
// 👇 1. AuthContext import add kiya
import { useAuth } from "../../../../context/AuthContext"; 
import styles from "./analytics.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  // 👇 2. useAuth hook ka use kiya
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState("Last 6 Months"); // New state for time filter
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 👇 3. Auth loading state check ki
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get(`/admin/analytics?timeFilter=${encodeURIComponent(timeFilter)}`);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    
  // 👇 4. Dependency array update kiya (timeFilter ko add kiya)
  }, [authLoading, isAuthenticated, timeFilter]);

  // Chart Data with Gradient-like properties
  const chartData = {
    labels: data?.revenueChart?.map((item: any) => item.month) || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: data?.revenueChart?.map((item: any) => item.revenue) || [0, 0, 0, 0, 0, 0],
        borderColor: "#0f5132",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(15, 81, 50, 0.2)");
          gradient.addColorStop(1, "rgba(15, 81, 50, 0.0)");
          return gradient;
        },
        fill: true,
        tension: 0.4, // Smooth curve
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Manual legend is better for design
      tooltip: {
        backgroundColor: "#1a202c",
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        displayColors: false,
      }
    },
    scales: {
      y: { grid: { display: false }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false } }
    }
  };

  const stats = [
    { 
      title: "Total Sales", 
      value: `₹${(data?.stats?.totalSales || 0).toLocaleString()}`, 
      trend: "+12.5%", 
      icon: <DollarSign size={20} />, 
      up: true 
    },
    { 
      title: "Total Orders", 
      value: (data?.stats?.totalOrders || 0).toLocaleString(), 
      trend: "+5.2%", 
      icon: <ShoppingBag size={20} />, 
      up: true 
    },
    { 
      title: "New Customers", 
      value: (data?.stats?.newCustomers || 0).toLocaleString(), 
      trend: "-2.4%", 
      icon: <Users size={20} />, 
      up: false 
    },
  ];

  if (loading) {
    return <DashboardLayout><div className={styles.chartSection}>Loading analytics...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics Overview</h1>
        <p className={styles.subtitle}>Track your business performance and growth</p>
      </div>

      {/* Stats Cards Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.iconBox}>{stat.icon}</div>
              <span className={stat.up ? styles.trendUp : styles.trendDown}>
                {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {stat.trend}
              </span>
            </div>
            <div className={styles.statInfo}>
              <h3 className={styles.statTitle}>{stat.title}</h3>
              <p className={styles.statValue}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h3>Sales Performance</h3>
          <select
            className={styles.timeFilter}
            value={timeFilter} // Controlled component ke liye current value set ki
            onChange={(e) => setTimeFilter(e.target.value)} // Value change hone par state update ki
          >
            <option>Last 6 Months</option>
            <option>Last 1 Year</option>
          </select>
        </div>
        <div className={styles.chartWrapper}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </DashboardLayout>
  );
}