"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./OrderCard.module.css";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { toast } from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";

interface Item {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  _id?: string;
  date: string;
  status: string;
  total: number;
  items: Item[];
  paymentStatus?: string;
  paymentMethod?: string;
  razorpay_order_id?: string;
}

export default function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const { products: allProducts } = useProducts();
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // 👇 FIX 1: Local state for instant UI update without page reload
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const handleViewDetails = () => {
    router.push(`/orders/${order.id}`);
  };

  const handleReorder = async () => {
    if (!order.items || order.items.length === 0) {
      toast.error("No items in this order to reorder.");
      return;
    }

    toast.loading("Adding items to cart...", { id: "reorder-toast" });

    const reorderPromises = order.items.map(item => {
      const productToReorder = allProducts.find(p => p._id === item.productId);
      if (productToReorder) {
        return addToCart(productToReorder, item.quantity, true);
      } else {
        console.warn(`Product with ID ${item.productId} not found for reorder.`);
        return Promise.resolve(null);
      }
    });

    try {
      await Promise.all(reorderPromises);
      toast.success("All items have been added to your cart!", { id: "reorder-toast" });
      setIsCartOpen(true);
    } catch (error) {
      toast.error("Some items could not be reordered.", { id: "reorder-toast" });
      console.error("Reorder failed:", error);
    }
  };

// Cashfree Web SDK v3 Loader
const loadCashfreeSDK = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Window not defined"));
    if ((window as any).Cashfree) {
      return resolve((window as any).Cashfree);
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).Cashfree) {
        resolve((window as any).Cashfree);
      } else {
        reject(new Error("Cashfree SDK failed to initialize"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.body.appendChild(script);
  });
};

  const handleRetryPayment = async () => {
    try {
      toast.loading("Opening secure checkout...", { id: "cf-retry" });
      const response = await axiosInstance.post(`/orders/${order._id || order.id}/cashfree-retry`);

      if (response.data.success && response.data.cashfree) {
        const { payment_session_id, environment } = response.data.cashfree;
        const Cashfree = await loadCashfreeSDK();
        const cashfree = Cashfree({
          mode: environment === "PRODUCTION" ? "production" : "sandbox",
        });

        toast.dismiss("cf-retry");
        const result = await cashfree.checkout({
          paymentSessionId: payment_session_id,
          redirectTarget: "_modal",
        });

        if (result && result.paymentDetails) {
          try {
            await axiosInstance.post("/orders/cashfree-verify", { cfOrderId: response.data.cashfree.order_id });
          } catch (e) {
            console.warn(e);
          }
          toast.success("Payment Successful! Order Confirmed.");
          window.location.reload();
        }
      } else if (response.data.payu) {
        // Fallback for PayU
        const { actionUrl, params } = response.data.payu;
        const form = document.createElement("form");
        form.method = "POST";
        form.action = actionUrl;
        Object.keys(params).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = params[key] ?? "";
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error(response.data.message || "Failed to initiate payment retry.", { id: "cf-retry" });
      }
    } catch (error: any) {
      console.error("Retry payment error:", error);
      toast.error(error.response?.data?.message || "Something went wrong initiating payment.", { id: "cf-retry" });
    }
  };

  const executeCancelOrder = async () => {
    setShowCancelModal(false); 
    try {
      toast.loading("Cancelling order...", { id: "cancel-toast" });
      
      const response = await axiosInstance.put(`/orders/${order._id || order.id}/cancel`);
      
      if (response.data.success) {
        toast.success("Order cancelled successfully!", { id: "cancel-toast" });
        // 👇 FIX 1: Instantly update UI instead of window.location.reload()
        setCurrentStatus("Cancelled"); 
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to cancel order.", { id: "cancel-toast" });
    }
  };

  // ✅ IsCancelled logic ab naye local state par kaam karega
  const isCancelled = currentStatus?.toLowerCase() === "cancelled";

  return (
    <>
      <div className={styles.card}>
        <div className={styles.topSection}>
          <div>
            <p className={styles.orderId}>Order ID: {order.id}</p>
            <p className={styles.date}>Placed on {order.date}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <span
                className={`${styles.status} ${
                    currentStatus === "Delivered"
                    ? styles.delivered
                    : currentStatus === "Processing"
                    ? styles.processing
                    : isCancelled
                    ? styles.cancelled
                    : styles.cancelled 
                }`}
                style={order.paymentStatus === 'pending' && order.paymentMethod !== 'COD' && !isCancelled ? { backgroundColor: '#ffeeba', color: '#856404', border: '1px solid #ffeeba' } : {}}
              >
                {/* Dynamically show local status */}
                {order.paymentStatus === 'pending' && order.paymentMethod !== 'COD' && !isCancelled ? 'Payment Pending' : currentStatus}
              </span>
              
              {order.paymentStatus === 'paid' && !isCancelled && (
                  <span style={{ color: "green", fontSize: "0.85rem", fontWeight: "bold" }}>
                      ✓ Paid
                  </span>
              )}
          </div>
        </div>

        <div className={styles.items}>
          {order.items.map((item, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.imageWrapper}>
                <Image src={item.image} alt={item.name} fill className={styles.image} />
              </div>

              <div className={styles.itemInfo}>
                <h4>{item.name}</h4>
                <p>Qty: {item.quantity}</p>
                <p>₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.total}>Total: ₹{order.total}</p>

          <div className={styles.actions}>
            {/* 👇 FIX 2: Dynamic Action Buttons */}
            {order.paymentStatus === 'pending' && order.paymentMethod !== 'COD' && !isCancelled ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                      className={styles.viewBtn} 
                      style={{ background: "#1a8e5f", color: "white", border: "none", padding: "0.5rem 1.5rem", fontWeight: "bold" }} 
                      onClick={handleRetryPayment}
                  >
                      Pay Now
                  </button>
                  <button 
                      className={styles.viewBtn} 
                      style={{ background: "#dc3545", color: "white", border: "none", padding: "0.5rem 1.5rem", fontWeight: "bold" }} 
                      onClick={() => setShowCancelModal(true)}
                  >
                      Cancel
                  </button>
              </div>
            ) : isCancelled ? (
              // Agar Cancelled hai toh SIRF Reorder button dikhega
              <button className={styles.reorderBtn} onClick={handleReorder}>Reorder</button>
            ) : (
              // Default state (Delivered/Processing)
              <>
                <button className={styles.viewBtn} onClick={handleViewDetails}>View Details</button>
                <button className={styles.reorderBtn} onClick={handleReorder}>Reorder</button>
              </>
            )}
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: 'white', padding: '2rem', borderRadius: '12px',
            maxWidth: '400px', width: '90%', textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.5rem' }}>Cancel Order?</h3>
            <p style={{ marginBottom: '1.5rem', color: '#666', lineHeight: '1.5' }}>
              Are you sure you want to cancel this pending order? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{ padding: '0.6rem 1.2rem', border: '1px solid #ccc', background: 'white', color: '#333', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}
              >
                No, Keep it
              </button>
              <button
                onClick={executeCancelOrder}
                style={{ padding: '0.6rem 1.2rem', border: 'none', background: '#dc3545', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}