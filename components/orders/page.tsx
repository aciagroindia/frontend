"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import Image from "next/image";
import Link from "next/link";
import styles from "./OrderDetails.module.css"; 
import { toast } from "react-hot-toast";

// Interfaces
interface Item {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderDetails {
  id: string;
  date: string;
  status: string;
  total: number;
  items: Item[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentStatus?: string;
  paymentMethod?: string;
  razorpay_order_id?: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { isAuthenticated, loading: authLoading } = useAuth();
  const { products: allProducts, loading: productsLoading } = useProducts();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || productsLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!id) return;

    // 👇 1. INSTANT LOAD LOGIC: Pehle cache se turant order uthao aur UI dikha do
    const cacheKey = `order_details_${id}`;
    const cachedOrder = localStorage.getItem(cacheKey);
    
    if (cachedOrder) {
      try {
        setOrder(JSON.parse(cachedOrder));
        setLoading(false); // Cache milte hi loading khatam, data screen par!
      } catch (e) {
        console.error("Cache parsing error", e);
      }
    }

    // 👇 2. BACKGROUND FETCH: Chup-chaap backend se fresh data mangwao
    const fetchOrderDetails = async () => {
      try {
        if (!cachedOrder) setLoading(true); // Agar pehli baar hai toh loader dikhao

        const response = await axiosInstance.get(`/orders/${id}`);
        if (response.data.success) {
          const orderData = response.data.data;

          // Map data (Logic 100% same hai)
          let statusText = "Processing";
          if (orderData.orderStatus === "delivered") statusText = "Delivered";
          else if (orderData.orderStatus === "shipped") statusText = "Shipped";
          else if (orderData.orderStatus === "cancelled" || orderData.orderStatus === "failed") statusText = "Cancelled";

          const formattedDate = new Date(orderData.createdAt).toLocaleDateString("en-GB", {
            day: 'numeric', month: 'short', year: 'numeric'
          });

          const mappedOrder: OrderDetails = {
            id: orderData._id,
            date: formattedDate,
            status: statusText,
            total: orderData.totalAmount,
            shippingAddress: orderData.shippingInfo || orderData.shippingAddress, 
            paymentStatus: orderData.paymentStatus,
            paymentMethod: orderData.paymentMethod,
            razorpay_order_id: orderData.razorpay_order_id,
            
            items: orderData.orderItems.map((item: any) => {
              const fullProduct = allProducts.find(p => p._id === item.product?._id || p._id === item.product);
              const image = fullProduct?.image || item.image || item.product?.image || "/placeholder.png";
              return {
                productId: item.product?._id || item.product,
                name: item.name || item.product?.name || "Product",
                quantity: item.quantity,
                price: item.price,
                image: image,
              };
            }),
          };

          setOrder(mappedOrder);
          // 👇 3. SAVE TO CACHE: Agli baar ke liye memory me save kar lo
          localStorage.setItem(cacheKey, JSON.stringify(mappedOrder));
        } else {
          toast.error("Could not fetch order details.");
        }
      } catch (error) {
        if (!cachedOrder) toast.error("Failed to load order details.");
        console.error("Fetch order details error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, isAuthenticated, authLoading, productsLoading, router, allProducts]);

  const loadBoltScript = (src: string) => {
    return new Promise((resolve) => {
      if ((window as any).bolt) {
        resolve(true);
        return;
      }
      const existingScript = document.getElementById("payu-bolt-script");
      if (existingScript) existingScript.remove();
      const script = document.createElement("script");
      script.id = "payu-bolt-script";
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // PayU Retry Payment logic for Details Page (Popup Overlay)
  const handleRetryPayment = async () => {
    if (!order) return;
    
    try {
      toast.loading("Opening secure PayU checkout...", { id: "payu-retry" });
      const response = await axiosInstance.post(`/orders/${order.id}/payu-retry`);

      if (response.data.success && response.data.payu) {
        const { actionUrl, boltScriptUrl, params } = response.data.payu;

        const scriptLoaded = await loadBoltScript(boltScriptUrl || "https://jssdk.payu.in/bolt/bolt.min.js");

        if (scriptLoaded && (window as any).bolt) {
          toast.dismiss("payu-retry");
          (window as any).bolt.launch(params, {
            responseHandler: async function (BOLT: any) {
              if (BOLT.response.txnStatus === "SUCCESS") {
                try {
                  const verifyRes = await axiosInstance.post("/orders/payu-verify", BOLT.response);
                  if (verifyRes.data.success) {
                    toast.success("Payment successful! Order Confirmed.");
                    window.location.reload();
                  } else {
                    toast.error("Payment verification pending.");
                  }
                } catch (vErr) {
                  console.error("Verification error:", vErr);
                }
              } else if (BOLT.response.txnStatus === "CANCEL") {
                toast.error("Payment was cancelled.");
              } else {
                toast.error("Payment failed. Please try again.");
              }
            },
            catchException: function (BOLT: any) {
              console.error("PayU Bolt exception:", BOLT);
              toast.error("Payment window closed or error occurred.");
            },
          });
          return;
        }

        // Fallback
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
        toast.error(response.data.message || "Failed to initiate payment retry.", { id: "payu-retry" });
      }
    } catch (error: any) {
      console.error("Retry payment error:", error);
      toast.error(error.response?.data?.message || "Something went wrong initiating payment.", { id: "payu-retry" });
    }
  };


  if (loading || authLoading || productsLoading) {
    return <div className={styles.container}><p>Loading order details...</p></div>;
  }

  if (!order) {
    return <div className={styles.container}><p>Order not found.</p></div>;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span>›</span>
        <Link href="/orders">My Orders</Link>
        <span>›</span>
        <span>Order #{order.id.slice(-6)}</span>
      </nav>

      <h1 className={styles.heading}>Order Details</h1>

      <div className={styles.summary}>
        <div><strong>Order ID:</strong> #{order.id}</div>
        <div><strong>Date:</strong> {order.date}</div>
        <div><strong>Status:</strong> <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>{order.status}</span></div>
        <div>
            <strong>Payment: </strong> 
            <span style={{ color: order.paymentStatus === 'paid' ? 'green' : 'orange', fontWeight: 'bold' }}>
                {order.paymentStatus === 'paid' ? 'Paid ✓' : 'Pending'}
            </span>
        </div>
        <div><strong>Total:</strong> ₹{order.total.toFixed(2)}</div>
        
        {/* FIX: Pay Now button UI */}
        {order.paymentStatus === 'pending' && order.paymentMethod !== 'COD' && (
            <div style={{ marginTop: '1rem' }}>
                <button 
                    onClick={handleRetryPayment}
                    style={{ background: "#1a8e5f", color: "white", border: "none", padding: "0.5rem 1.5rem", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                >
                    Pay Now
                </button>
            </div>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.itemsSection}>
          <h2>Items in this Order</h2>
          {order.items.map(item => (
            <div key={item.productId} className={styles.itemCard}>
              <div className={styles.itemImage}>
                <Image src={item.image} alt={item.name} width={80} height={80} style={{ objectFit: 'cover' }} />
              </div>
              <div className={styles.itemDetails}>
                <Link href={`/products/${allProducts.find(p => p._id === item.productId)?.slug || ''}`}>
                  <strong>{item.name}</strong>
                </Link>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price.toFixed(2)}</p>
              </div>
              <div className={styles.itemTotal}>
                <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.addressSection}>
          <h2>Shipping Address</h2>
          <div className={styles.addressCard}>
            <p><strong>{order.shippingAddress?.name || 'N/A'}</strong></p>
            <p>{order.shippingAddress?.address || 'No address provided'}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
            <p>Phone: {order.shippingAddress?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}