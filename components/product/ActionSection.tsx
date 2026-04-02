"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ActionSection.module.css";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Heart } from "lucide-react";

interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

export default function ActionSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const router = useRouter();

  const baseProductId = product._id || product.id.split('-')[0];

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    sessionStorage.setItem("buyNowItem", JSON.stringify({ ...product, quantity }));
    router.push("/checkout?mode=buyNow");
  };

  return (
    <div className={styles.wrapper}>
      
      {/* FIX: Class name buttonRow kiya aur dono ko ek parent div mein daal diya */}
      <div className={styles.buttonRow}>
        <div className={styles.quantityBox}>
          <button className={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <input type="text" value={quantity} readOnly className={styles.qtyInput} />
          <button className={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
        
        {/* Ye button ab quantity ke side mein aayega */}
        <button className={styles.primaryBtn} onClick={handleAddToCart}>
          Add to Cart
        </button>

        <button
          className={styles.wishlistBtn}
          onClick={() => toggleWishlist({ ...product, id: baseProductId, _id: baseProductId })}
          aria-label="Add to wishlist"
        >
          <Heart fill={isInWishlist(baseProductId) ? "#1a8e5f" : "none"} color="#1a8e5f" />
        </button>
      </div>

      <button className={styles.secondaryBtn} onClick={handleBuyNow}>
        Buy It Now
      </button>

      <p className={styles.delivery}>
        🚚 Extra 5% OFF on all prepaid orders
      </p>
    </div>
  );
}