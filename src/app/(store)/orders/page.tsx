"use client";

import { useEffect, useState, Suspense } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../../../context/AuthContext";
import { useProducts } from "../../../../context/ProductContext";
import styles from "./Orders.module.css";
import OrderCard from "../../../../components/orders/OrderCard";
import GoogleCustomerReviewsOptIn, { calculateEstimatedDeliveryDate } from "../../../../components/GoogleCustomerReviewsOptIn";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

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
  payu_txnid?: string;
  rawCreatedAt?: string;
  customerEmail?: string;
}

const getOrderStatusText = (status: string): string => {
  switch (status) {
    case "delivered":
      return "Delivered";
    case "shipped":
      return "Shipped";
    case "cancelled":
    case "failed":
      return "Cancelled";
    case "created":
    default:
      return "Processing";
  }
};

function OrdersContent() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { products: allProducts, loading: productsLoading, fetchProducts } = useProducts();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ensure products are fetched so items and reorder work reliably
  useEffect(() => {
    if (allProducts.length === 0 && typeof fetchProducts === "function") {
      fetchProducts();
    }
  }, [allProducts.length, fetchProducts]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Check for Cashfree & PayU callback status params in URL
  useEffect(() => {
    const cfOrderId = searchParams.get("order_id");
    const cfOrderStatus = searchParams.get("order_status");
    const status = searchParams.get("status");
    const orderId = searchParams.get("orderId");
    const reason = searchParams.get("reason");

    if (cfOrderId) {
      if (cfOrderStatus === "PAID" || cfOrderStatus === "SUCCESS") {
        toast.success("Payment Successful! Order Placed Successfully.", { id: "payment-status" });
      } else if (cfOrderStatus === "FAILED" || cfOrderStatus === "USER_DROPPED") {
        toast.error("Payment was not completed. You can retry paying below.", { id: "payment-status" });
      }
      // Instant S2S verification sync
      axiosInstance.post("/orders/cashfree-verify", { cfOrderId }).catch((err) => {
        console.warn("Cashfree background verification check:", err?.message);
      });
    } else if (status === "success") {
      toast.success(orderId ? `Payment Successful for Order #${orderId.slice(-6)}!` : "Payment Successful! Order Placed.", { id: "payment-status" });
    } else if (status === "failed") {
      const msg = reason ? `Payment Failed: ${reason.replace(/_/g, ' ')}` : "Payment was not completed or failed.";
      toast.error(msg, { id: "payment-status" });
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading || productsLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/orders/my-orders");

        if (response.data.success) {
          const mappedOrders: Order[] = response.data.data.map((order: any) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return {
              id: order._id,
              _id: order._id,
              date: formattedDate,
              status: getOrderStatusText(order.orderStatus),
              total: order.totalAmount,
              paymentStatus: order.paymentStatus,
              paymentMethod: order.paymentMethod,
              razorpay_order_id: order.razorpay_order_id,
              payu_txnid: order.payu_txnid,
              rawCreatedAt: order.createdAt,
              customerEmail: order.shippingInfo?.email || order.shippingAddress?.email || (typeof order.customer === 'object' ? order.customer?.email : ''),
              items: order.orderItems.map((item: any) => {
                const rawProd = item.product;
                const rawProdId = rawProd?._id || rawProd?.id || rawProd;
                const cleanProductId = typeof rawProdId === "object" ? String(rawProdId?._id || rawProdId?.id || "") : String(rawProdId || "");
                const fullProduct = allProducts.find((p) => String(p._id) === cleanProductId || String(p.id) === cleanProductId);
                const image = fullProduct?.image || item.image || rawProd?.image || "/assets/placeholder.png";
                return {
                  productId: cleanProductId,
                  name: fullProduct?.name || item.name || rawProd?.name || "Product",
                  quantity: item.quantity || 1,
                  price: item.price || fullProduct?.price || 0,
                  image: image,
                  slug: fullProduct?.slug || rawProd?.slug || "",
                };
              }),
            };
          });

          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, authLoading, router, productsLoading, allProducts]);

  if (authLoading || loading || productsLoading) {
    return (
      <div className={styles.container} style={{ textAlign: "center", minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Loading orders...</h2>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Identify if current page load is a newly completed / successful order
  const cfOrderId = searchParams.get("order_id");
  const cfOrderStatus = searchParams.get("order_status");
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  const isOrderSuccessful =
    (cfOrderId && (cfOrderStatus === "PAID" || cfOrderStatus === "SUCCESS")) ||
    status === "success";

  const matchingOrder = isOrderSuccessful
    ? orders.find(
        (o) =>
          o.id === orderId ||
          o._id === orderId ||
          o.id === cfOrderId ||
          o._id === cfOrderId ||
          o.razorpay_order_id === orderId ||
          o.payu_txnid === orderId
      ) || (orders.length > 0 ? orders[0] : null)
    : null;

  const targetOrderId = matchingOrder?._id || matchingOrder?.id || orderId || cfOrderId;
  const customerEmail = matchingOrder?.customerEmail || user?.email || "";
  const estimatedDeliveryDate = calculateEstimatedDeliveryDate(matchingOrder?.rawCreatedAt);

  return (
    <div className={styles.container}>
      {/* 🌿 Order Confirmation Banner for Newly Completed Orders */}
      {isOrderSuccessful && targetOrderId && (
        <div style={{
          backgroundColor: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: "1rem",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          color: "#065f46",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "9999px",
            backgroundColor: "#d1fae5",
            color: "#059669",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "#064e3b" }}>
              Order Confirmed Successfully! 🌿
            </h2>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "#047857" }}>
              Thank you for choosing ACI Agro Solution. Your order #{targetOrderId.slice(-6).toUpperCase()} has been confirmed and is being prepared for dispatch.
            </p>
          </div>
        </div>
      )}

      {/* 🌟 Google Customer Reviews Survey Opt-In (Merchant ID: 5317000737) */}
      {isOrderSuccessful && targetOrderId && customerEmail && (
        <GoogleCustomerReviewsOptIn
          orderId={targetOrderId}
          customerEmail={customerEmail}
          deliveryCountry="IN"
          estimatedDeliveryDate={estimatedDeliveryDate}
        />
      )}

      <h1 className={styles.heading}>My Orders 🌿</h1>

      {orders.length === 0 ? (
        <p className={styles.empty}>You haven't placed any orders yet.</p>
      ) : (
        <div className={styles.ordersWrapper}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className={styles.container} style={{ textAlign: "center", padding: "4rem" }}>Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}