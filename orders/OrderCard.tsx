"use client";

import Image from "next/image";
import styles from "./OrderCard.module.css";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
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
  date: string;
  status: string;
  total: number;
  items: Item[];
}

export default function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const { products: allProducts } = useProducts();

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
        // Call addToCart silently.
        return addToCart(productToReorder, item.quantity, true);
      } else {
        console.warn(`Product with ID ${item.productId} not found for reorder.`);
        return Promise.resolve(null);
      }
    });

    try {
      await Promise.all(reorderPromises);
      toast.success("All items have been added to your cart!", { id: "reorder-toast" });
      setIsCartOpen(true); // Open cart once after all items are added
    } catch (error) {
      toast.error("Some items could not be reordered.", { id: "reorder-toast" });
      console.error("Reorder failed:", error);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.topSection}>
        <div>
          <p className={styles.orderId}>Order ID: {order.id}</p>
          <p className={styles.date}>Placed on {order.date}</p>
        </div>

        <span
          className={`${styles.status} ${
            order.status === "Delivered"
              ? styles.delivered
              : order.status === "Processing"
              ? styles.processing
              : styles.cancelled
          }`}
        >
          {order.status}
        </span>
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
          <button className={styles.viewBtn} onClick={handleViewDetails}>View Details</button>
          <button className={styles.reorderBtn} onClick={handleReorder}>Reorder</button>
        </div>
      </div>
    </div>
  );
}