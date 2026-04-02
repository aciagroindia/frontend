"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "../../../../../components/admin-layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import { ArrowLeft, User, ShoppingCart, Package, Truck } from "lucide-react";
import { toast } from "react-hot-toast";
import styles from "./page.module.css";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // GET /api/admin/orders/:id
        const response = await axiosInstance.get(`/admin/orders/${orderId}`);
        if (response.data.success) {
          console.log("FULL ORDER DATA:", response.data.data); // 👈 Ye line add karein
          setOrder(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      // PUT /api/admin/orders/:id/status
      const response = await axiosInstance.put(`/admin/orders/${orderId}/status`, { 
        status: newStatus 
      });
      if (response.data.success) {
        setOrder({ ...order, orderStatus: newStatus });
        toast.success("Order status updated to " + newStatus);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <DashboardLayout><div className={styles.loading}>Loading Order...</div></DashboardLayout>;
  if (!order) return <DashboardLayout><div className={styles.error}>Order Not Found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button onClick={() => router.push("/admin/orders")} className={styles.backBtn}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className={styles.title}>Order Details</h1>
              <p className={styles.subtitle}>ID: #{order._id.toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className={styles.layoutGrid}>
          {/* Main Column: Items & Customer */}
          <div className={styles.mainCol}>
            
            {/* Items Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}><ShoppingCart size={20} /> <h2>Items List</h2></div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className={styles.productInfo}>
                        <img src={item.image || "/placeholder.png"} alt={item.name} />
                        <span>{item.name}</span>
                      </td>
                      <td>₹{item.price.toLocaleString()}</td>
                      <td>{item.quantity}</td>
                      <td>₹{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.totalRow}>
                <span>Total Amount:</span>
                <span className={styles.price}>₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Customer & Address Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}><User size={20} /> <h2>Customer Info</h2></div>
              <div className={styles.infoGrid}>
                <div><label>Customer Name</label><p>{order.customer?.name || "N/A"}</p></div>
                <div><label>Email Address</label><p>{order.customer?.email || "N/A"}</p></div>
                <div className={styles.fullWidth}>
                  <label>Shipping Address</label>
                  <p>{order.shippingInfo ? `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pinCode}` : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Status Update */}
          <div className={styles.sideCol}>
            <div className={`${styles.card} ${styles.statusCard}`}>
              <div className={styles.cardHeader}><Package size={20} /> <h2>Order Status</h2></div>
              
              {/* Current Status Badge */}
              <div className={`${styles.statusBadge} ${styles[order.orderStatus.replace(/\s+/g, '').toLowerCase()]}`}>
                {order.orderStatus.toUpperCase()}
              </div>
              
              <div className={styles.divider} />

              <label className={styles.inputLabel}>Change Status</label>
              <select 
                className={styles.select} 
                value={order.orderStatus} 
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
              >
                <option value="created">Pending</option>
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <p className={styles.helpText}>
                Selecting a status will automatically update the user's view.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}