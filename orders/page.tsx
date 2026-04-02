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

    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`/orders/${id}`);
        if (response.data.success) {
          const orderData = response.data.order;

          // Map data
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
            shippingAddress: orderData.shippingAddress,
            items: orderData.orderItems.map((item: any) => {
              const fullProduct = allProducts.find(p => p._id === item.product?._id);
              const image = fullProduct?.image || item.image || item.product?.image || "/assets/placeholder.png";
              return {
                productId: item.product?._id,
                name: item.name || item.product?.name || "Product",
                quantity: item.quantity,
                price: item.price,
                image: image,
              };
            }),
          };
          setOrder(mappedOrder);
        } else {
          toast.error("Could not fetch order details.");
        }
      } catch (error) {
        toast.error("Failed to load order details.");
        console.error("Fetch order details error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, isAuthenticated, authLoading, productsLoading, router, allProducts]);

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
        <div><strong>Total:</strong> ₹{order.total.toFixed(2)}</div>
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
            <p><strong>{order.shippingAddress.name}</strong></p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}