"use client";

import { useProducts } from "../../context/ProductContext";
import ProductCard from "../collection/ProductCard";
import styles from "./RelatedProducts.module.css";

export default function RelatedProducts() {
  const { relatedProducts, loading } = useProducts();

  if (!loading && relatedProducts.length === 0) return null;

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>People Also Bought</h2>
      
      <div className={styles.grid}>
        {relatedProducts.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {loading && <p>Loading related products...</p>}
      </div>
    </section>
  );
}