"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./ProductInfo.module.css";
import PricingPlans, { Plan } from "./PricingPlans";
import ActionSection from "./ActionSection";

interface Props {
  product: any;
}

export default function ProductInfo({ product }: Props) {
  // Generate net quantity options including the main base product variant + any extra packages
  const quantityOptions: Plan[] = useMemo(() => {
    const baseUnit = product.unit?.trim() || "";
    const basePrice = Number(product.price) || 0;
    const hasPackages = Array.isArray(product.packages) && product.packages.length > 0;

    const options: Plan[] = [];

    // 1. Base / Main Variant (Always included first)
    if (baseUnit || !hasPackages) {
      options.push({
        id: "base",
        name: baseUnit || "1000ml",
        month: baseUnit || "1000ml",
        details: "Main Pack",
        price: basePrice,
        regularPrice: basePrice,
        discount: 0,
        badge: "",
      });
    }

    // 2. Extra / Additional Variants from packages
    if (hasPackages) {
      product.packages.forEach((pkg: any, index: number) => {
        const pkgName = pkg.name?.trim();
        if (!pkgName) return;

        // Check if package duplicates base unit name
        const isDuplicateOfBase = baseUnit && pkgName.toLowerCase() === baseUnit.toLowerCase();
        if (isDuplicateOfBase) {
          const baseIndex = options.findIndex((opt) => opt.id === "base");
          if (baseIndex !== -1) {
            options[baseIndex] = {
              id: pkg._id || pkg.id || `pkg-${index}`,
              name: pkgName,
              month: pkgName,
              details: pkg.details || "",
              price: Number(pkg.price) || basePrice,
              regularPrice: Number(pkg.price) || basePrice,
              discount: 0,
              badge: "",
            };
            return;
          }
        }

        options.push({
          id: pkg._id || pkg.id || `pkg-${index}`,
          name: pkgName,
          month: pkgName,
          details: pkg.details || "",
          price: Number(pkg.price) || basePrice,
          regularPrice: Number(pkg.price) || basePrice,
          discount: 0,
          badge: "",
        });
      });
    }

    // Fallback if empty
    if (options.length === 0) {
      options.push({
        id: "default",
        name: "1000ml",
        month: "1000ml",
        details: "",
        price: basePrice,
        regularPrice: basePrice,
        discount: 0,
        badge: "",
      });
    }

    return options;
  }, [product.price, product.packages, product.unit]);

  // Auto-selected by default (e.g. 1000ml if single size, or first size option)
  const [selectedPlan, setSelectedPlan] = useState<Plan>(quantityOptions[0]);

  // Handle case where product data updates or changes
  useEffect(() => {
    if (quantityOptions && quantityOptions.length > 0) {
      setSelectedPlan(quantityOptions[0]);
    }
  }, [product._id, product.id]);

  const productVariant = {
    ...product,
    price: selectedPlan.price,
    id: `${product._id || product.id}-${selectedPlan.id}`,
    name: product.name,
    variant: selectedPlan.name || selectedPlan.month || product.unit || "1000ml",
  };

  return (
    <div className={styles.info}>
      <h1 className={styles.title}>{product.name}</h1>

      <div className={styles.reviews}>
        <div className={styles.stars} aria-label={`Rated ${product.rating || 5} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              style={{ color: i < Math.round(product.rating || 5) ? "#1b7f3c" : "#ccc" }}
            >
              ★
            </span>
          ))}
        </div>
        <span className={styles.reviewsCount}>
          {product.rating ? Number(product.rating).toFixed(1) : "5.0"} ({product.numReviews || 0} reviews)
        </span>
      </div>

      <div className={styles.priceContainer}>
        <span className={styles.salePrice}>₹{selectedPlan.price}</span>
        {selectedPlan.regularPrice && selectedPlan.regularPrice > selectedPlan.price ? (
          <>
            <span className={styles.regularPrice}>₹{selectedPlan.regularPrice.toFixed(2)}</span>
            {selectedPlan.discount && selectedPlan.discount > 0 ? (
              <span className={styles.discountBadge}>-{selectedPlan.discount}%</span>
            ) : null}
          </>
        ) : null}
      </div>

      <p className={styles.stock}>
        {product.stock > 0
          ? `🔥 Hurry up! Only ${product.stock} item(s) left in stock`
          : "❌ Out of stock"}
      </p>

      <PricingPlans
        plans={quantityOptions}
        selectedPlan={selectedPlan}
        onPlanSelect={setSelectedPlan}
      />
      
      <ActionSection product={productVariant} />

      <div className={styles.trustBadges}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🌿</span>
          <span>100% Ayurvedic Formulation</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🔬</span>
          <span>Lab-Tested For Purity</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📜</span>
          <span>Certified Organic Products</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>✨</span>
          <span>No Harmful Chemicals</span>
        </div>
      </div>
    </div>
  );
}