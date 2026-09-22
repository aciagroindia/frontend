"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./FeaturedProducts.module.css";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useProducts } from "../../context/ProductContext";

const getCloudinaryUrl = (src: string, width = 384, quality = "auto") => {
  if (!src || !src.includes("res.cloudinary.com")) return src;
  const params = `f_auto,q_${quality},w_${width},c_limit`;
  return src.replace("/upload/", `/upload/${params}/`);
};

export default function FeaturedProducts({ initialBestSellers = [] }: { initialBestSellers?: any[] }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { bestSellers, loading, fetchBestSellers } = useProducts();

  const products = initialBestSellers && initialBestSellers.length > 0 ? initialBestSellers : bestSellers;

  useEffect(() => {
    if (products.length === 0) {
      fetchBestSellers();
    }
  }, [products.length, fetchBestSellers]);

  // ✅ Wishlist check logic
  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id || (item as any)._id === id);
  };

  // Loading state dikhane ke liye - sleek skeleton cards
  if (loading && products.length === 0) {
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
          {products.length > 0 ? (
            products.map((product: any) => {
              const prodId = product.id || product._id;
              const rawImage = product.image;
              const isCloudinary = rawImage && rawImage.includes("res.cloudinary.com");
              const optimizedSrc = isCloudinary ? getCloudinaryUrl(rawImage, 384) : rawImage;

              return (
                <div key={prodId} className={styles.card}>
                  
                  {/* ❤️ Wishlist Icon */}
                  <div
                    className={`${styles.wishlist} ${
                      isInWishlist(prodId) ? styles.activeWishlist : ""
                    }`}
                    onClick={() => toggleWishlist(product)}
                    aria-label="Wishlist"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={isInWishlist(prodId) ? "#14854e" : "none"}
                      stroke="#14854e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>

                  <Link href={`/products/${product.slug}`} prefetch={false}>
                    <div className={styles.imageWrapper}>
                      {rawImage ? (
                        <Image
                          src={optimizedSrc}
                          alt={product.name}
                          fill
                          className={styles.image}
                          sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          unoptimized={Boolean(isCloudinary)}
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
              );
            })
          ) : (
            <p>No best selling products found.</p>
          )}
        </div>
      </div>
    </section>
  );
}