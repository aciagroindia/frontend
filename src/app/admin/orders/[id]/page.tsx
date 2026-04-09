"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "../../../../../components/admin-layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import { ArrowLeft, User, ShoppingCart, Package, CreditCard } from "lucide-react"; // FIX: Added CreditCard icon
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
        const response = await axiosInstance.get(`/admin/orders/${orderId}`);
        if (response.data.success) {
          console.log("FULL ORDER DATA:", response.data.data);
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
    // FIX: Safety Check - Prevent shipping unpaid online orders
    if (newStatus === 'shipped' || newStatus === 'delivered') {
      if (order.paymentStatus === 'pending' && order.paymentMethod !== 'COD') {
        toast.error("Cannot ship! Payment is still pending for this online order.");
        return; // Rok do
      }
    }

    setUpdatingStatus(true);
    try {
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

          {/* Sidebar: Status Update & Payment Info */}
          <div className={styles.sideCol}>
            
            {/* FIX: New Payment Info Card */}
            <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
              <div className={styles.cardHeader}><CreditCard size={20} /> <h2>Payment Info</h2></div>
              <div style={{ marginTop: '1rem' }}>
                <p style={{ marginBottom: '0.5rem' }}><strong>Method:</strong> {order.paymentMethod || 'Online'}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{
                    color: order.paymentStatus === 'paid' ? 'green' : 'red',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    backgroundColor: order.paymentStatus === 'paid' ? '#e6ffe6' : '#ffe6e6',
                    borderRadius: '4px'
                  }}>
                    {order.paymentStatus ? order.paymentStatus.toUpperCase() : 'PENDING'}
                  </span>
                </p>
                
                {/* Warning if payment is not received */}
                {order.paymentStatus === 'pending' && order.paymentMethod !== 'COD' && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', borderLeft: '4px solid #ffeeba', fontSize: '0.9rem' }}>
                    ⚠️ <strong>WARNING:</strong> Payment is pending for this online order. Do not process or ship until paid.
                  </div>
                )}
              </div>
            </div>

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