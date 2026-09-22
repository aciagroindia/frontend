"use client";

import { useEffect } from "react";
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
  const { bestSellers, loading, fetchBestSellers } = useProducts(); // 2. Context se bestSellers aur loading li

  useEffect(() => {
    if (bestSellers.length === 0) {
      fetchBestSellers();
    }
  }, [bestSellers.length, fetchBestSellers]);

  // ✅ Wishlist check logic
  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  // Loading state dikhane ke liye - sleek skeleton cards
  if (loading && bestSellers.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.heading}>BEST SELLING PRODUCTS</h2>
          <div className={styles.grid}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.card} style={{ pointerEvents: 'none' }}>
                <div className={styles.imageWrapper} style={{ backgroundColor: '#f3f4f6', animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: '18px', background: '#e5e7eb', borderRadius: '4px', margin: '12px 10px 6px', animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: '36px', background: '#e5e7eb', borderRadius: '6px', margin: '10px', animation: 'pulse 1.5s infinite' }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
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

                <Link href={`/products/${product.slug}`} prefetch={true}>
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