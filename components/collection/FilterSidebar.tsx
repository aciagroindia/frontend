"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "../../context/CategoryContext";
import { useProducts } from "../../context/ProductContext";
import styles from "./FilterSidebar.module.css";

export default function FilterSidebar() {
  const { categories } = useCategories();
  const { bestSellers } = useProducts();

  const [openSections, setOpenSections] = useState({
    category: true,
    bestSellers: true,
  });

  const toggleSection = (section: "category" | "bestSellers") => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <div
          role="button"
          tabIndex={0}
          className={styles.sidebarCategoryButtonWrapper}
          onClick={() => toggleSection("category")}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleSection('category');
            }
          }}
        >
          <span>CATEGORY</span>
          <span className={styles.toggleButton}>
            <Image
              src={
                openSections.category
                  ? "/assets/remove.svg"
                  : "/assets/add.svg"
              }
              alt=""
              width={20}
              height={20}
            />
          </span>
        </div>
        {openSections.category && (
          <div className={styles.collapsibleContent}>
            {categories.map((cat) => (
              <Link key={cat._id} href={`/collections/${cat.slug}`} className={styles.categoryLink}>
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div
          role="button"
          tabIndex={0}
          className={styles.sidebarCategoryButtonWrapper}
          onClick={() => toggleSection("bestSellers")}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleSection('bestSellers');
            }
          }}
        >
          <span>BEST SELLERS</span>
          <span className={styles.toggleButton}>
            <Image
              src={
                openSections.bestSellers
                  ? "/assets/remove.svg"
                  : "/assets/add.svg"
              }
              alt=""
              width={20}
              height={20}
            />
          </span>
        </div>
        {openSections.bestSellers && (
          <div className={styles.collapsibleContent}>
            {bestSellers.slice(0, 4).map((product) => (
              <Link key={product._id} href={`/products/${product.slug}`} className={styles.bestItem}>
                {product.image ? (
                  <Image src={product.image} alt={product.name} width={60} height={60} style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 60, height: 60, backgroundColor: '#f0f0f0' }} />
                )}
                <div>
                  <p>{product.name}</p>
                  <div className={styles.stars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < (product.rating || 5) ? '#1b7f3c' : '#ccc' }}>★</span>
                    ))}
                  </div>
                  <p className={styles.price}>₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}