"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./ShopByConcern.module.css";
import { useCategories } from "../../context/CategoryContext";

export default function ShopByConcern() {
  const { categories, loading } = useCategories();

  return (
    <section className={styles.section}>
      <h1 className={styles.heading}>SHOP BY CATEGORY</h1>

      <div className={styles.grid}>
        {loading && categories.length === 0 ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className={styles.card} style={{ pointerEvents: 'none' }}>
              <div className={styles.imageWrapper} style={{ background: '#f3f4f6', animation: 'pulse 1.5s infinite' }} />
              <div className={styles.name} style={{ color: '#d1d5db' }}>...</div>
            </div>
          ))
        ) : (
          categories.map((category, index) => (
            <Link 
              key={category._id} 
              href={`/collections/${category.slug}`} 
              className={styles.card}
              prefetch={true}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={category.image || "/certifiedIcons/product.jpeg"}
                  alt={category.name}
                  width={100} 
                  height={100}
                  className={styles.image}
                  priority={index < 4} 
                />
              </div>
              <div className={styles.name}>{category.name}</div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}