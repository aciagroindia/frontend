"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import AdvancedTable from "../../../../components/admin-ui/AdvancedTable";
import axiosInstance from "@/utils/axiosInstance"; // ✅ use this
import styles from "./OrdersPage.module.css";
import { toast } from "react-hot-toast";

interface Order {
  id: string;
  _id: string;
  order?: string;
  customer: any;
  amount: number | string;
  totalAmount?: number | string;
  orderStatus: string;
  trackingId?: string;
  courierName?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/admin/orders"); // ✅ FIXED
      if (response.data.success) {
        setOrders(response.data.data || response.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleShipOrder = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      const response = await axiosInstance.post(`/admin/orders/${orderId}/ship`); // ✅ FIXED
      if (response.data.success) {
        toast.success("Order shipped successfully!");
        setOrders(prev =>
          prev.map(o => o._id === orderId ? response.data.data : o)
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to ship order");
    } finally {
      setProcessingId(null);
    }
  };

  const handleTrack = async (orderId: string) => {
    try {
      const response = await axiosInstance.get(`/admin/orders/${orderId}/track`); // ✅ FIXED
      if (response.data.success) {
        toast((t) => (
          <span>
            Current Status: <b>{response.data.status}</b>
            <button onClick={() => toast.dismiss(t.id)} style={{ marginLeft: 10 }}>
              Close
            </button>
          </span>
        ), { duration: 4000 });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to track order");
    }
  };

  const columns = [
    { 
      key: "id", 
      label: "Order ID", 
      render: (val: string, row: Order) => {
        const displayId = val || row._id || '';
        return (
          <span 
            title={displayId} // Mouse le jane par poori ID dikhegi
            style={{ fontSize: '0.85rem', cursor: 'help', fontFamily: 'monospace' }}
          >
            #{displayId.slice(0, 8)}...
          </span>
        )
      }
    },
    { 
      key: "customer", 
      label: "Customer",
      render: (val: any, row: Order) => {
        if (row.customer && typeof row.customer === 'object') {
          return row.customer.name || "N/A";
        }
        return row.customer || "N/A";
      }
    },
    { 
      key: "amount", 
      label: "Amount", 
      render: (val: any, row: Order) => {
        const displayAmount = val || row.totalAmount;
        if (typeof displayAmount === 'string' && displayAmount.startsWith('₹')) return displayAmount;
        return `₹${Number(displayAmount || 0).toLocaleString()}`;
      }
    },
    {
      key: "status",
      label: "Status",
      render: (_: any, row: Order) => {
        const currentStatus = (row.orderStatus || 'pending').toLowerCase();

        const statusConfig: { [key:string]: {text: string, className: string} } = {
          'created': { text: 'Pending', className: styles.pending },
          'pending': { text: 'Pending', className: styles.pending },
          'processing': { text: 'Processing', className: styles.confirmed },
          'confirmed': { text: 'Confirmed', className: styles.confirmed },
          'shipped': { text: 'Shipped', className: styles.shipped },
          'out for delivery': { text: 'Out for Delivery', className: styles.outfordelivery },
          'delivered': { text: 'Delivered', className: styles.delivered },
          'cancelled': { text: 'Cancelled', className: styles.cancelled },
        };

        const config = statusConfig[currentStatus] || { text: currentStatus, className: styles.pending };
        const displayText = config.text.charAt(0).toUpperCase() + config.text.slice(1);

        return (
          <span className={`${styles.badge} ${config.className}`}>
            {displayText}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: Order) => {
        const orderId = row._id || row.id;
        return (
          <div className={styles.actions}>
            <button
              className={styles.viewBtn}
              onClick={() => router.push(`/admin/orders/${orderId}`)}
            >
              View
            </button>

            {row.trackingId && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button 
                  className={styles.trackBtn} 
                  onClick={() => handleTrack(orderId)}
                >
                  Track
                </button>
                <span className={styles.trackingId}>{row.trackingId}</span>
              </div>
            )}
          </div>
        );
      }
    }
  ];

  if (loading) {
    return <DashboardLayout><div className={styles.card}>Loading orders...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Orders Management</h1>
          <p className={styles.subtitle}>Manage and track your store orders</p>
        </div>
      </div>

      <div className={styles.card}>
        <AdvancedTable columns={columns} data={orders} />
      </div>
    </DashboardLayout>
  );
}