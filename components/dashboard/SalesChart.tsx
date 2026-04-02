"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./SalesChart.module.css";

// Custom Tooltip for a premium look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipValue}>
          ₹{payload[0].value.toLocaleString()} <span>Sales</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function SalesChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard/sales-chart");
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching sales chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return <div className={styles.container}>Loading chart...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.chartHeader}>
        <div className={styles.titleInfo}>
          <h3 className={styles.title}>Sales Performance</h3>
          <p className={styles.subtitle}>Monthly revenue statistics</p>
        </div>
        <select className={styles.timeFilter}>
          <option>Last 7 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f5132" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0f5132" stopOpacity={0} />
              </linearGradient>
            </defs>
 
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={10}
              interval="preserveStartEnd"
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#0f5132", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#0f5132"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
              animationBegin={0}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
