"use client";

import { useState } from "react";
import styles from "./ProductGallery.module.css";

interface Product {
  name: string;
  image: string;
  images?: string[];
}

interface Props {
  product: Product;
}

export default function ProductGallery({ product }: Props) {
  // Combine the main image and the gallery images for display.
  // The main image (`product.image`) should always be first.
  const displayImages = [product.image, ...(product.images || [])].filter(Boolean);

  // State to track the index of the selected image
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.mainImageContainer}>
        <img
          src={displayImages[selectedIndex]}
          alt={product.name}
          className={styles.mainImage}
        />
      </div>

      <div className={styles.thumbnailRow}>
        {displayImages.map((img, idx) => (
          <div
            key={idx}
            className={`${styles.thumb} ${
              idx === selectedIndex ? styles.activeThumb : ""
            }`}
            onClick={() => setSelectedIndex(idx)}
          >
            <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}