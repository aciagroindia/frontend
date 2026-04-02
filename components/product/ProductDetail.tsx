"use client";

import { useState, useEffect } from "react";
import { useProducts, Product } from "../../context/ProductContext";
import styles from "./ProductDetail.module.css";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";
import ProductTabs from "./ProductTabs";
import RecentlyViewed from "../collection/RecentlyViewed";

interface Props {
  slug: string;
}

export default function ProductDetail({ slug }: Props) {
  const { products, fetchProductBySlug, fetchRelatedProducts, lastUpdatedProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);

      // 1) Prefer latest updated product state from context (admin update path)
      if (lastUpdatedProduct?.slug === slug) {
        setProduct(lastUpdatedProduct);
      }

      // 2) Fallback to in-memory product list (fast and immediate, after admin changes)
      const cached = products.find((p) => p.slug === slug);
      if (cached) {
        setProduct(cached);
      }

      // 3) Fetch fresh from backend (source of truth) after rendering cached data.
      const [data] = await Promise.all([
        fetchProductBySlug(slug),
        fetchRelatedProducts(slug)
      ]);

      if (data) {
        setProduct(data);
      }
      
      if (data) {
        // Tracking: Add to Recently Viewed
        const stored = localStorage.getItem("recentlyViewed");
        let list = stored ? JSON.parse(stored) : [];
        list = list.filter((p: any) => p._id !== data._id);
        list.unshift(data);
        if (list.length > 20) list.pop();
        localStorage.setItem("recentlyViewed", JSON.stringify(list));
      }
      setLoading(false);
    };
    loadProduct();
  }, [slug, fetchProductBySlug, fetchRelatedProducts, lastUpdatedProduct]);

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}>Loading...</div>;

  if (!product) {
    return <div style={{ textAlign: "center", padding: "100px", fontSize: "20px" }}>Product Not Found</div>;
  }

  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <div className={styles.topSection}>
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>

      {/* Niche ke sections (Inki styling hum next step me update karenge) */}
      <ProductTabs product={product} />
      <RelatedProducts />
      <RecentlyViewed />
    </div>
  );
}