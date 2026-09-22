"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useProducts, Product, normalizeProduct } from "../../context/ProductContext";
import styles from "./ProductDetail.module.css";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

// 👇 NAYA: Lazy load "niche ke sections" to speed up the initial Hero load
const ProductTabs = dynamic(() => import("./ProductTabs"), { ssr: false });
const RelatedProducts = dynamic(() => import("./RelatedProducts"), { ssr: false });
const RecentlyViewed = dynamic(() => import("../collection/RecentlyViewed"), { ssr: false });

interface Props {
  slug: string;
  initialProduct?: any;
}

export default function ProductDetail({ slug, initialProduct }: Props) {
  const { products, fetchProductBySlug, fetchRelatedProducts, lastUpdatedProduct } = useProducts();
  
  // 👇 NAYA: Synchronous cache check. If we have the product in memory or from server, load it instantly!
  const [product, setProduct] = useState<Product | null>(() => {
    if (initialProduct && initialProduct.slug === slug) {
      return normalizeProduct ? normalizeProduct(initialProduct) : initialProduct;
    }
    if (lastUpdatedProduct?.slug === slug) return lastUpdatedProduct;
    const cached = products.find((p) => p.slug === slug);
    return cached || null;
  });

  // 👇 NAYA: Only show loading screen if we have absolutely NO cached or initial product
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    let isMounted = true;

    // Track to recently viewed safely in idle time (non-blocking)
    if (product) {
      const updateRecent = () => {
        try {
          const stored = localStorage.getItem("recentlyViewed");
          let list = stored ? JSON.parse(stored) : [];
          if (Array.isArray(list)) {
            list = list.filter((p: any) => p && (p._id !== product._id && p.id !== product.id));
            list.unshift(product);
            if (list.length > 20) list.pop();
            localStorage.setItem("recentlyViewed", JSON.stringify(list));
          }
        } catch (e) {}
      };

      if (typeof window !== "undefined") {
        if ("requestIdleCallback" in window) {
          (window as any).requestIdleCallback(updateRecent);
        } else {
          setTimeout(updateRecent, 1500);
        }
      }
    }

    const loadProduct = async () => {
      try {
        const [freshData] = await Promise.all([
          !product ? fetchProductBySlug(slug) : Promise.resolve(null),
          fetchRelatedProducts(slug)
        ]);

        if (isMounted && freshData) {
          setProduct(freshData);
          try {
            const stored = localStorage.getItem("recentlyViewed");
            let list = stored ? JSON.parse(stored) : [];
            if (Array.isArray(list)) {
              list = list.filter((p: any) => p && (p._id !== freshData._id && p.id !== freshData.id));
              list.unshift(freshData);
              if (list.length > 20) list.pop();
              localStorage.setItem("recentlyViewed", JSON.stringify(list));
            }
          } catch (e) {}
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug, fetchProductBySlug, fetchRelatedProducts]);

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}>Loading...</div>;

  if (!product && !loading) {
    return <div style={{ textAlign: "center", padding: "100px", fontSize: "20px" }}>Product Not Found</div>;
  }

  // ✅ TS Ignore/Check fallback just in case
  if (!product) return null;

  const categorySlug =
    product.category && typeof (product.category as any).slug === "string"
      ? (product.category as any).slug
      : null;
  const categoryName = product.category?.name || null;

  return (
    <div className={styles.wrapper}>
      {/* Visual Accessible Breadcrumb */}
      <div className={styles.breadcrumbWrapper}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link href="/" className={styles.breadcrumbLink}>
                Home
              </Link>
              <span className={styles.breadcrumbSeparator}>›</span>
            </li>
            {categorySlug && categoryName ? (
              <li className={styles.breadcrumbItem}>
                <Link
                  href={`/collections/${categorySlug}`}
                  className={styles.breadcrumbLink}
                >
                  {categoryName}
                </Link>
                <span className={styles.breadcrumbSeparator}>›</span>
              </li>
            ) : null}
            <li className={styles.breadcrumbItem}>
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>
      </div>

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