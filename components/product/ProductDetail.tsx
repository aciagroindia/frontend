"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useProducts, Product } from "../../context/ProductContext";
import styles from "./ProductDetail.module.css";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

// 👇 NAYA: Lazy load "niche ke sections" to speed up the initial Hero load
const ProductTabs = dynamic(() => import("./ProductTabs"), { ssr: false });
const RelatedProducts = dynamic(() => import("./RelatedProducts"), { ssr: false });
const RecentlyViewed = dynamic(() => import("../collection/RecentlyViewed"), { ssr: false });

interface Props {
  slug: string;
}

export default function ProductDetail({ slug }: Props) {
  const { products, fetchProductBySlug, fetchRelatedProducts, lastUpdatedProduct } = useProducts();
  
  // 👇 NAYA: Synchronous cache check. If we have the product in memory, load it instantly!
  const [product, setProduct] = useState<Product | null>(() => {
    if (lastUpdatedProduct?.slug === slug) return lastUpdatedProduct;
    const cached = products.find((p) => p.slug === slug);
    return cached || null;
  });

  // 👇 NAYA: Only show loading screen if we have absolutely NO cached product
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Fetch fresh from backend (source of truth) in the background
        const [freshData] = await Promise.all([
          fetchProductBySlug(slug),
          fetchRelatedProducts(slug)
        ]);

        if (freshData) {
          setProduct(freshData); // Silently update with fresh data
          
          // Tracking: Add to Recently Viewed
          const stored = localStorage.getItem("recentlyViewed");
          let list = stored ? JSON.parse(stored) : [];
          list = list.filter((p: any) => p._id !== freshData._id);
          list.unshift(freshData);
          if (list.length > 20) list.pop();
          localStorage.setItem("recentlyViewed", JSON.stringify(list));
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        // Only matter for the initial load if there was no cache
        setLoading(false); 
      }
    };

    loadProduct();
  }, [slug, fetchProductBySlug, fetchRelatedProducts, lastUpdatedProduct]);

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}>Loading...</div>;

  if (!product && !loading) {
    return <div style={{ textAlign: "center", padding: "100px", fontSize: "20px" }}>Product Not Found</div>;
  }

  // ✅ TS Ignore/Check fallback just in case
  if (!product) return null;

  return (
    <div className={styles.wrapper}>
      {/* Hero Section - Loads instantly now */}
      <div className={styles.topSection}>
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>

      {/* Niche ke sections - Loads slightly after the hero section */}
      <ProductTabs product={product} />
      <RelatedProducts />
      <RecentlyViewed />
    </div>
  );
}