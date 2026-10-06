"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import styles from "./ProductGallery.module.css";

interface Product {
  name: string;
  image: string;
  images?: string[];
  packages?: any[];
}

interface Props {
  product: Product;
  variantImage?: string | null;
}

export default function ProductGallery({ product, variantImage }: Props) {
  // 1. Eagerly preload all candidate images (main, gallery, variants) into browser cache
  useEffect(() => {
    if (typeof window === "undefined") return;
    const allUrls = [
      product.image,
      ...(product.images || []),
      ...(product.packages || []).map((p) => p.image).filter(Boolean)
    ].filter(Boolean) as string[];

    allUrls.forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  }, [product]);

  const baseImages = useMemo(
    () => [product.image, ...(product.images || [])].filter(Boolean),
    [product.image, product.images]
  );

  const displayImages = useMemo(() => {
    if (variantImage && variantImage.trim()) {
      return [variantImage, ...baseImages.filter((img) => img !== variantImage)];
    }
    return baseImages;
  }, [variantImage, baseImages]);

  const [activeThumbIndex, setActiveThumbIndex] = useState<number | null>(null);
  const [prevVariant, setPrevVariant] = useState(variantImage);

  // Synchronously reset active thumbnail when variant image changes (Zero-delay render)
  if (variantImage !== prevVariant) {
    setPrevVariant(variantImage);
    setActiveThumbIndex(null);
  }

  const activeIndex = activeThumbIndex !== null ? activeThumbIndex : 0;
  const currentImage = displayImages[activeIndex] || product.image;

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.mainImageContainer}>
        {currentImage ? (
          <Image
            key={currentImage} // Key ensures instant paint
            src={currentImage}
            alt={product.name}
            fill
            priority={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.mainImage}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", backgroundColor: "#f3f4f6" }} />
        )}
      </div>

      <div className={styles.thumbnailRow}>
        {displayImages.map((img, idx) => (
          <div
            key={`${img}-${idx}`}
            role="button"
            tabIndex={0}
            aria-label={`View ${product.name} image ${idx + 1}`}
            className={`${styles.thumb} ${
              idx === activeIndex ? styles.thumbActive : ""
            }`}
            onClick={() => setActiveThumbIndex(idx)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveThumbIndex(idx);
              }
            }}
          >
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