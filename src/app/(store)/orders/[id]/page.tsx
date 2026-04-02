"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { ArrowLeft, User, ShoppingCart, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import styles from "./page.module.css";
import Image from "next/image";

// ... interfaces same rahenge ...

export default function UserOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`/orders/${orderId}`);
        if (response.data.success) setOrder(response.data.data);
      } catch (error) {
        toast.error("Error fetching order details");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return <div className={styles.loader}>Loading...</div>;
  if (!order) return <div className={styles.container}>Order not found.</div>;

  // Status Stepper Logic
  const steps = ["created", "processing", "shipped", "delivered"];
  const currentStepIdx = steps.indexOf((order.orderStatus || "").toLowerCase());

  return (
    <div className={styles.container}>
      {/* Action Header - Print Button added */}
      <div className={styles.topActions}>
        <button onClick={() => router.push("/orders")} className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Orders
        </button>
      </div>

      <div className={styles.billWrapper}>
        {/* Header: Order Info */}
        <header className={styles.billHeader}>
          <div className={styles.brandInfo}>
            <h1 className={styles.brandTitle}>INVOICE</h1>
            <p className={styles.orderIdText}>Order ID: #{(order?._id || '').toUpperCase()}</p>
            <p className={styles.dateText}>Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</p>
          </div>
          <div className={`${styles.statusBadge} ${styles[(order.orderStatus || 'pending').replace(/\s+/g, '').toLowerCase()]}`}>
            {(order.orderStatus || 'Pending').toUpperCase()}
          </div>
        </header>

        {/* Order Stepper - Visual Progress Bar */}
        <div className={styles.stepper}>
          {steps.map((step, idx) => (
            <div key={step} className={`${styles.step} ${idx <= currentStepIdx ? styles.activeStep : ""}`}>
              <div className={styles.stepCircle}>{idx < currentStepIdx ? <CheckCircle size={16} /> : idx + 1}</div>
              <span className={styles.stepLabel}>{step}</span>
              {idx < steps.length - 1 && <div className={styles.stepLine}></div>}
            </div>
          ))}
        </div>

        <div className={styles.billGrid}>
          {/* Left: Items Table */}
          <section className={styles.mainContent}>
            <div className={styles.sectionHeader}>
              <ShoppingCart size={18} /> <h3>Order Items</h3>
            </div>
            <table className={styles.invoiceTable}>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th className={styles.textRight}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems?.map((item: any, i: number) => (
                  <tr key={i}>
                    <td className={styles.productCell}>
                      <div className={styles.productThumb}>
                         <img src={item.image || "/placeholder.png"} alt={item.name} />
                      </div>
                      <div>
                        <p className={styles.pName}>{item.name}</p>
                        <span className={styles.pId}>SKU: {item.product?._id?.slice(-6)}</span>
                      </div>
                    </td>
                    <td>{item.quantity || 0}</td>
                    <td>₹{(item.price || 0).toLocaleString()}</td>
                    <td className={styles.textRight}>₹{((item.quantity || 0) * (item.price || 0)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Right: Summary & Address */}
          <aside className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <h3>Payment Summary</h3>
              <div className={styles.priceRow}>
                <span>Subtotal</span>
                <span>₹{(order.totalAmount || 0).toLocaleString()}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Shipping</span>
                <span className={styles.free}>FREE</span>
              </div>
              <div className={styles.priceRow}>
                <span>GST (Incl.)</span>
                <span>₹0.00</span>
              </div>
              <div className={`${styles.priceRow} ${styles.grandTotal}`}>
                <span>Total Amount</span>
                <span>₹{(order.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.addressCard}>
              <div className={styles.sectionHeader}>
                <Truck size={18} /> <h3>Delivery Address</h3>
              </div>
              <p className={styles.addressName}>{order.customer?.name || "Customer"}</p>
              <p>{order.shippingInfo?.address}</p>
              <p>{order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pinCode}</p>
              <p>Country: {order.shippingInfo?.country}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}