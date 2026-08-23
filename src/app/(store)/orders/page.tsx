"use client";

import { useEffect, useState, Suspense } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../../../context/AuthContext";
import { useProducts } from "../../../../context/ProductContext";
import styles from "./Orders.module.css";
import OrderCard from "../../../../components/orders/OrderCard";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

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
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { products: allProducts, loading: productsLoading } = useProducts();
  const router = useRouter();
  const searchParams = useSearchParams();

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
              items: order.orderItems.map((item: any) => {
                const productId = item.product?._id || item.product;
                const fullProduct = allProducts.find(p => p._id === productId);
                const image = fullProduct?.image || item.image || item.product?.image || "/assets/placeholder.png";
                return {
                  productId: productId,
                  name: fullProduct?.name || item.name || item.product?.name || "Product",
                  quantity: item.quantity,
                  price: item.price,
                  image: image,
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

  return (
    <div className={styles.container}>
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