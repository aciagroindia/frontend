"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../../../context/AuthContext";
import { useProducts } from "../../../../context/ProductContext";
import styles from "./Orders.module.css";
import OrderCard from "../../../../components/orders/OrderCard";
import { useRouter } from "next/navigation";

// Define the expected structure based on the OrderCard props
interface Item {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: Item[];
}

// Helper function to get user-friendly status text
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

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { products: allProducts, loading: productsLoading } = useProducts();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to initialize before redirecting or fetching
    if (authLoading || productsLoading) return;

    if (!isAuthenticated) {
      router.push("/store/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/orders/my-orders");
        
        if (response.data.success) {
          // Map backend Order schema to Frontend OrderCard UI schema
          const mappedOrders: Order[] = response.data.data.map((order: any) => {
            // Format date to e.g., '22 Mar 2026'
            const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return {
              id: order._id,
              date: formattedDate,
              status: getOrderStatusText(order.orderStatus),
              total: order.totalAmount,
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

  if (!isAuthenticated) return null; // Prevent flicker before redirect

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