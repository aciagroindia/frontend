"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./FeaturedProducts.module.css";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useProducts } from "../../context/ProductContext"; // 1. useProducts import kiya
import { Heart } from "lucide-react";

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { bestSellers, loading } = useProducts(); // 2. Context se bestSellers aur loading li

  // ✅ Wishlist check logic
  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  // Loading state dikhane ke liye
  if (loading) {
    return <div className={styles.container}>Loading best sellers...</div>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>BEST SELLING PRODUCTS</h2>

        <div className={styles.grid}>
          {/* 3. Ab bestSellers map ho rahe hain jo MongoDB se aaye hain */}
          {bestSellers.length > 0 ? (
            bestSellers.map((product) => (
              <div key={product.id} className={styles.card}>
                
                {/* ❤️ Wishlist Icon */}
                <div
                  className={`${styles.wishlist} ${
                    isInWishlist(product.id) ? styles.activeWishlist : ""
                  }`}
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart
                    size={18}
                    fill={isInWishlist(product.id) ? "#14854e" : "none"}
                    color="#14854e"
                  />
                </div>

                <Link href={`/products/${product.slug}`}>
                  <div className={styles.imageWrapper}>
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={styles.image}
                        sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
                    )}
                  </div>

                  <h3 className={styles.productName}>{product.name}</h3>
                </Link>

                <div className={styles.rating}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={
                        index < (product.rating ?? 0)
                          ? styles.starFilled
                          : styles.starEmpty
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <button
                  className={styles.button}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p>No best selling products found.</p>
          )}
        </div>
      </div>
    </section>
  );
}