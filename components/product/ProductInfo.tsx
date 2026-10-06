"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./ProductInfo.module.css";
import PricingPlans, { Plan } from "./PricingPlans";
import ActionSection from "./ActionSection";

interface Props {
  product: any;
  selectedPlan?: Plan | null;
  onSelectPlan?: (plan: Plan) => void;
  onVariantChange?: (plan: Plan) => void;
}

export default function ProductInfo({ product, selectedPlan, onSelectPlan, onVariantChange }: Props) {
  // Generate variant plans strictly from product.packages
  const quantityOptions: Plan[] = useMemo(() => {
    const hasPackages = Array.isArray(product.packages) && product.packages.length > 0;
    const baseUnit = product.unit?.trim() || "";
    const basePrice = Number(product.price) || 0;

    if (hasPackages) {
      return product.packages
        .filter((pkg: any) => pkg && pkg.name && pkg.name.trim())
        .map((pkg: any, index: number) => ({
          id: pkg._id || pkg.id || `pkg-${index}`,
          name: pkg.name.trim(),
          month: pkg.name.trim(),
          details: pkg.details || "",
          price: Number(pkg.price) || 0,
          regularPrice: Number(pkg.regularPrice) || Number(pkg.price) || 0,
          discount: Number(pkg.discount) || 0,
          badge: pkg.badge || "",
          image: pkg.image || "",
        }));
    }

    // Fallback if no packages exist in DB
    return [
      {
        id: "default",
        name: baseUnit || "1 Unit",
        month: baseUnit || "1 Unit",
        details: "",
        price: basePrice,
        regularPrice: basePrice,
        discount: 0,
        badge: "",
        image: product.image || "",
      },
    ];
  }, [product.packages, product.price, product.unit, product.image]);

  const [internalPlan, setInternalPlan] = useState<Plan>(quantityOptions[0]);

  // Synchronously keep internal plan matched with options if product changes
  const [prevOptions, setPrevOptions] = useState(quantityOptions);
  if (quantityOptions !== prevOptions) {
    setPrevOptions(quantityOptions);
    const found = quantityOptions.find((p) => p.id === internalPlan?.id);
    setInternalPlan(found || quantityOptions[0]);
  }

  const currentPlan = selectedPlan || internalPlan || quantityOptions[0] || { id: "default", name: "1 Unit", price: Number(product.price) || 0 };

  const handlePlanSelect = (plan: Plan) => {
    setInternalPlan(plan);
    if (onSelectPlan) {
      onSelectPlan(plan);
    }
    if (onVariantChange) {
      onVariantChange(plan);
    }
  };

  const isOutOfStock = product.status === "Inactive" || Number(product.stock) <= 0;

  const productVariant = {
    ...product,
    price: Number(currentPlan.price || 0),
    variant: currentPlan.name || currentPlan.month || "",
    packageId: currentPlan.id,
    image: currentPlan.image || product.image,
    id: `${product._id || product.id}-${currentPlan.id}`,
    productId: product._id || product.id,
    name: product.name,
    isOutOfStock,
    stock: product.stock,
    status: product.status,
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
        <span className={styles.salePrice}>₹{currentPlan.price}</span>
        {currentPlan.regularPrice && currentPlan.regularPrice > currentPlan.price ? (
          <>
            <span className={styles.regularPrice}>₹{currentPlan.regularPrice.toFixed(2)}</span>
            {currentPlan.discount && currentPlan.discount > 0 ? (
              <span className={styles.discountBadge}>-{currentPlan.discount}%</span>
            ) : null}
          </>
        ) : null}
      </div>

      {isOutOfStock ? (
        <div className={styles.stockStatusContainer}>
          <span className={styles.outOfStockBadge}>
            <span className={styles.statusDotRed}></span>
            Out of Stock
          </span>
          <span className={styles.stockSubText}>Currently unavailable</span>
        </div>
      ) : (
        <div className={styles.stockStatusContainer}>
          <span className={styles.inStockBadge}>
            <span className={styles.statusDotGreen}></span>
            {product.stock} {Number(product.stock) === 1 ? "Item" : "Items"} Remaining
          </span>
          {Number(product.stock) <= 15 && (
            <span className={styles.lowStockWarning}>🔥 Hurry up! Only {product.stock} left in stock</span>
          )}
        </div>
      )}

      <PricingPlans
        plans={quantityOptions}
        selectedPlan={currentPlan}
        onPlanSelect={handlePlanSelect}
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