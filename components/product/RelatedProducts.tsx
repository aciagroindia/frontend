
"use client";

import type { Product } from "../../context/ProductContext";
import ProductCard from "../collection/ProductCard";
import styles from "./RelatedProducts.module.css";

interface Props {
  products: Product[];
}

export default function RelatedProducts({ products }: Props) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>People Also Bought</h2>

      <div className={styles.grid}>
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
