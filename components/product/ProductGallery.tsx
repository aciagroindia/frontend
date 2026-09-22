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

// Cloudinary direct loader for LCP optimization
const cloudinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  if (!src || !src.includes("res.cloudinary.com")) {
    return src;
  }
  const params = `f_auto,q_${quality || "auto"},w_${width},c_limit`;
  return src.replace("/upload/", `/upload/${params}/`);
};

export default function ProductGallery({ product }: Props) {
  const displayImages = [product.image, ...(product.images || [])].filter(Boolean);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.mainImageContainer}>
        {/* 👇 NAYA: Optimized Main Image with direct Cloudinary delivery and priority loading */}
        <Image
          loader={displayImages[selectedIndex]?.includes("res.cloudinary.com") ? cloudinaryLoader : undefined}
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
            role="button"
            tabIndex={0}
            aria-label={`View ${product.name} image ${idx + 1}`}
            className={`${styles.thumb} ${
              idx === selectedIndex ? styles.thumbActive : "" // Fixed class name to match CSS
            }`}
            onClick={() => setSelectedIndex(idx)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedIndex(idx);
              }
            }}
          >
            {/* 👇 NAYA: Optimized Thumbnails */}
            <Image 
              src={img} 
              alt={`${product.name} - Natural Ayurvedic formulation angle ${idx + 1}`} 
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