"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import styles from "./CollectionLayout.module.css";
import SortBar from "./SortBar";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "./ProductCard";
import VedistPillar from "./Pillar";
import RecentlyViewed from "./RecentlyViewed";
import DescriptionSection from "./DescriptionSection";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface Props {
  title: string;
  description?: string;
  products: Product[];
}

export type SortOption = "best-selling" | "price-asc" | "price-desc";

export default function CollectionLayout({ title, description, products }: Props) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("best-selling");

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isFilterOpen]);

  const formattedTitle =
    title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

  const sortedProducts = useMemo(() => {
    const sortableProducts = [...products];
    switch (sortOption) {
      case "price-asc":
        return sortableProducts.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sortableProducts.sort((a, b) => b.price - a.price);
      case "best-selling":
      default:
        return products;
    }
  }, [products, sortOption]);

  return (
    <div className={styles.wrapper}>
      {/* Banner */}
      <section className={styles.banner}>
        <p><Link href="/">Home</Link>/ <span>{formattedTitle}</span></p>
        <h1>{title}</h1>
      </section>

      <div className={styles.container}>
        
        {/* OVERLAY */}
        {isFilterOpen && (
          <div
            className={styles.overlay}
            onClick={() => setIsFilterOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`${styles.sidebarWrapper} ${
            isFilterOpen ? styles.open : ""
          }`}
        >
          <div className={styles.mobileSidebarHeader}>
            <h3>Filters</h3>
            <button
              className={styles.closeButton}
              onClick={() => setIsFilterOpen(false)}
              aria-label="Close filters"
            >
              <Image src="/assets/Close.svg" alt="" width={24} height={24} />
            </button>
          </div>
          <FilterSidebar />
        </div>

        <section className={styles.productsSection}>
          <div className={styles.productsHeader}>
            <button
              className={styles.mobileFilterButton}
              onClick={() => setIsFilterOpen(true)}
            >
              Filters
            </button>
            <SortBar sortOption={sortOption} onSortChange={setSortOption} />
          </div>

          <div className={styles.grid}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>

      <VedistPillar />
      <RecentlyViewed />
      <DescriptionSection title={title} description={description} />
    </div>
  );
}