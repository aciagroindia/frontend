"use client";

import { useState } from "react";
import Image from "next/image"; // 👇 NAYA: Next.js optimized Image component
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
  const displayImages = [product.image, ...(product.images || [])].filter(Boolean);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.mainImageContainer}>
        {/* 👇 NAYA: Optimized Main Image with priority loading */}
        <Image
          src={displayImages[selectedIndex]}
          alt={product.name}
          fill
          priority={true} // Forces browser to load this immediately (LCP boost)
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.mainImage}
        />
      </div>

      <div className={styles.thumbnailRow}>
        {displayImages.map((img, idx) => (
          <div
            key={idx}
            className={`${styles.thumb} ${
              idx === selectedIndex ? styles.thumbActive : "" // Fixed class name to match CSS
            }`}
            onClick={() => setSelectedIndex(idx)}
          >
            {/* 👇 NAYA: Optimized Thumbnails */}
            <Image 
              src={img} 
              alt={`${product.name} thumbnail ${idx + 1}`} 
              fill
              sizes="80px"
              className={styles.thumbImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}