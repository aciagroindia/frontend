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
  productId?: string;
  packageId?: string;
  variant?: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  stock?: number;
  status?: string;
  isOutOfStock?: boolean;
}

export default function ActionSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const router = useRouter();

  const isOutOfStock = Boolean(
    product.isOutOfStock ||
    product.status === "Inactive" ||
    (product.stock !== undefined && Number(product.stock) <= 0)
  );

  const baseProductId = product._id || product.id.split('-')[0];

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    sessionStorage.setItem("buyNowItem", JSON.stringify({ ...product, quantity }));
    router.push("/checkout?mode=buyNow");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttonRow}>
        <div className={`${styles.quantityBox} ${isOutOfStock ? styles.quantityBoxDisabled : ""}`}>
          <button
            className={styles.qtyBtn}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={isOutOfStock}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input
            type="text"
            value={quantity}
            readOnly
            disabled={isOutOfStock}
            className={styles.qtyInput}
            aria-label="Selected quantity"
          />
          <button
            className={styles.qtyBtn}
            onClick={() => setQuantity(quantity + 1)}
            disabled={isOutOfStock}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          className={`${styles.primaryBtn} ${isOutOfStock ? styles.disabledBtn : ""}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>

        <button
          className={styles.wishlistBtn}
          onClick={() => toggleWishlist({ ...product, id: baseProductId, _id: baseProductId })}
          aria-label={isInWishlist(baseProductId) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart fill={isInWishlist(baseProductId) ? "#1a8e5f" : "none"} color="#1a8e5f" />
        </button>
      </div>

      <button
        className={`${styles.secondaryBtn} ${isOutOfStock ? styles.disabledSecondaryBtn : ""}`}
        onClick={handleBuyNow}
        disabled={isOutOfStock}
        aria-label={isOutOfStock ? "Product is out of stock" : "Buy it now immediately"}
      >
        {isOutOfStock ? "Out of Stock" : "Buy It Now"}
      </button>

      {isOutOfStock ? (
        <p className={styles.outOfStockNotice}>
          ⚠️ This product is currently out of stock. Add to your wishlist to buy when available.
        </p>
      ) : (
        <p className={styles.delivery}>
          🚚 Extra 5% OFF on all prepaid orders
        </p>
      )}
    </div>
  );
}