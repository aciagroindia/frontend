"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./ShopByConcern.module.css";
import { useCategories } from "../../context/CategoryContext";

export default function ShopByConcern() {
  const { categories, loading } = useCategories();

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>SHOP BY CATEGORY</h2>

      <div className={styles.grid}>
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          categories.map((category) => (
            <Link 
              key={category._id} 
              href={`/collections/${category.slug}`} 
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={category.image || "/certifiedIcons/product.jpeg"}
                  alt={category.name}
                  width={100} // Thoda bada size for better quality
                  height={100}
                  className={styles.image}
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