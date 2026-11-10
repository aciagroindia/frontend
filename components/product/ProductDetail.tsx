"use client";
import { cleanProductName } from "@/utils/productName";
import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  useProducts,
  Product,
  normalizeProduct,
} from "../../context/ProductContext";
import styles from "./ProductDetail.module.css";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";

const RecentlyViewed = dynamic(
  () => import("../collection/RecentlyViewed"),
  { ssr: false }
);

interface Props {
  slug: string;
  initialProduct?: any;
  initialRelatedProducts?: Product[];
  initialMoreProducts?: Product[];
}

export default function ProductDetail({
  slug,
  initialProduct,
  initialRelatedProducts = [],
  initialMoreProducts = [],
}: Props) {
  const { products, fetchProductBySlug, lastUpdatedProduct } = useProducts();

  // Load product from server data or existing cache
  const [product, setProduct] = useState<Product | null>(() => {
    if (initialProduct) {
      return normalizeProduct(initialProduct);
    }

    if (lastUpdatedProduct?.slug === slug) {
      return lastUpdatedProduct;
    }

    const cached = products.find(
      (p) =>
        p.slug === slug ||
        p.slug?.toLowerCase() === slug?.toLowerCase()
    );

    return cached || null;
  });

  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    let isMounted = true;

    // Track recently viewed product
    const saveRecentlyViewed = (item: Product) => {
      try {
        const stored = localStorage.getItem("recentlyViewed");
        let list = stored ? JSON.parse(stored) : [];

        if (Array.isArray(list)) {
          list = list.filter(
            (p: any) =>
              p &&
              p._id !== item._id &&
              p.id !== item.id
          );

          list.unshift(item);

          if (list.length > 20) {
            list.pop();
          }

          localStorage.setItem(
            "recentlyViewed",
            JSON.stringify(list)
          );
        }
      } catch (e) {}
    };

    if (product) {
      saveRecentlyViewed(product);
    }

    const loadProduct = async () => {
      try {
        if (!product) {
          const freshData = await fetchProductBySlug(slug);

          if (isMounted && freshData) {
            setProduct(freshData);
            saveRecentlyViewed(freshData);
          }
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
  }, [slug, fetchProductBySlug]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        Loading...
      </div>
    );
  }

  if (!product && !loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px",
          fontSize: "20px",
        }}
      >
        Product Not Found
      </div>
    );
  }

  if (!product) return null;

  const categorySlug =
    product.category &&
    typeof (product.category as any).slug === "string"
      ? (product.category as any).slug
      : null;

  const categoryName = product.category?.name || null;

  // Normalize server-rendered related products
  const normalizedRelatedProducts = initialRelatedProducts
    .filter(
      (item) =>
        item &&
        item.slug &&
        item.status === "Active" &&
        Number(item.stock) > 0
    )
    .map((item) => normalizeProduct(item));

  // Internal linking ke liye extra products (jo pehle se "related" mein hain unhe dobara nahi dikhate)
  const relatedSlugs = new Set(normalizedRelatedProducts.map((item) => item.slug));
  const normalizedMoreProducts = initialMoreProducts
    .filter((item) => item && item.slug && item.status === "Active" && !relatedSlugs.has(item.slug))
    .map((item) => normalizeProduct(item));

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
              <span
                className={styles.breadcrumbCurrent}
                aria-current="page"
              >
                {cleanProductName(product.name)}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Product Hero Section */}
      <ProductDetailHero product={product} />

      {/* Product Details */}
      <ProductTabs product={product} />

      {/* Server-rendered Related Products */}
      <RelatedProducts products={normalizedRelatedProducts} />
      <RelatedProducts products={normalizedMoreProducts} heading="Explore More Products" />

      <RecentlyViewed />
    </div>
  );
}

function ProductDetailHero({ product }: { product: Product }) {
  const [selectedPlan, setSelectedPlan] = useState<any>(() => {
    if (Array.isArray(product.packages) && product.packages.length > 0) {
      const first = product.packages[0] as any;

      return {
        id: first._id || first.id || "pkg-0",
        name: first.name,
        month: first.name,
        price: first.price,
        image: first.image || "",
      };
    }

    return null;
  });

  // Keep selected package in sync with product
  useEffect(() => {
    if (
      Array.isArray(product.packages) &&
      product.packages.length > 0
    ) {
      setSelectedPlan((prev: any) => {
        if (prev) {
          const matched = product.packages.find(
            (p: any) =>
              (p._id || p.id) === (prev._id || prev.id)
          );

          if (matched) {
            return {
              id: (matched as any)._id || (matched as any).id,
              name: matched.name,
              month: matched.name,
              price: matched.price,
              image: (matched as any).image || "",
            };
          }
        }

        const first = product.packages[0] as any;

        return {
          id: first._id || first.id || "pkg-0",
          name: first.name,
          month: first.name,
          price: first.price,
          image: first.image || "",
        };
      });
    }
  }, [product]);

  const variantImage = selectedPlan?.image || null;

  return (
    <div className={styles.topSection}>
      <ProductGallery
        product={product}
        variantImage={variantImage}
      />

      <ProductInfo
        product={product}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
      />
    </div>
  );
}
