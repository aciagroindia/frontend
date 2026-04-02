"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./ProductInfo.module.css";
import PricingPlans, { Plan } from "./PricingPlans";
import ActionSection from "./ActionSection";

interface Props {
  product: any;
}

export default function ProductInfo({ product }: Props) {
  // Generate pricing plans based on real packages if available, otherwise use base product price as the default plan
  const pricingOptions: Plan[] = useMemo(() => {
    // Explicitly check for packages array and its content
    const hasPackages = Array.isArray(product.packages) && product.packages.length > 0;
    
    if (hasPackages) {
      return product.packages.map((pkg: any, index: number) => ({
        id: pkg._id || pkg.id || `pkg-${index}`,
        month: pkg.name || "Unnamed Variant",
        details: pkg.details || "",
        price: Number(pkg.price),
        regularPrice: pkg.regularPrice ? Number(pkg.regularPrice) : Number(pkg.price),
        discount: pkg.discount ? Number(pkg.discount) : 0,
        badge: pkg.badge || "",
      }));
    }

    // Default "Standard Pack" using the product's base price and unit
    return [
      {
        id: "default",
        month: product.unit || "Base Pack",
        details: "Standard Bottle",
        price: product.price,
        regularPrice: product.price, // No regular price in base product currently
        discount: 0,
        badge: "",
      }
    ];
  }, [product.price, product.packages, product.unit]);

  const [selectedPlan, setSelectedPlan] = useState<Plan>(pricingOptions[0]);

  // Handle case where product price might have changed since first render
  useEffect(() => {
    setSelectedPlan(pricingOptions[0]);
  }, [product.price, pricingOptions]);

  // Create a product variant based on the selected plan to pass to the cart
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const strippedDescription = product.description?.replace(/<[^>]*>/g, '') || '';
  const shortDescription = strippedDescription.slice(0, 100);

  const productVariant = {
    ...product,
    price: selectedPlan.price,
    id: `${product._id || product.id}-${selectedPlan.id}`,
    name: `${product.name} (${selectedPlan.month})`,
  };

  return (
    <div className={styles.info}>
        <h1 className={styles.title}>{product.name}</h1>
        
        <div className={styles.reviews}>
          <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < Math.round(product.rating || 0) ? '#1b7f3c' : '#ccc' }}>★</span>
              ))}
          </div>
          <span>({product.numReviews || 0} reviews)</span>
        </div>
        
        <p
          className={styles.description}
          onClick={() => setIsDescriptionExpanded((prev) => !prev)}
          style={{ cursor: 'pointer' }}
          role="button"
          aria-expanded={isDescriptionExpanded}
        >
          {isDescriptionExpanded
            ? strippedDescription
            : `${shortDescription}${strippedDescription.length > 100 ? '...' : ''}`}
        </p>

        <div className={styles.priceContainer}>
          <span className={styles.salePrice}>₹{selectedPlan.price}</span>
          {selectedPlan.regularPrice && selectedPlan.regularPrice > selectedPlan.price && (
            <>
              <span className={styles.regularPrice}>₹{selectedPlan.regularPrice.toFixed(2)}</span>
              {selectedPlan.discount && selectedPlan.discount > 0 && (
                <span className={styles.discountBadge}>-{selectedPlan.discount}%</span>
              )}
            </>
          )}
        </div>
  
        <p className={styles.stock}>
            {product.stock > 0 
                ? `🔥 Hurry up! Only ${product.stock} item(s) left in stock` 
                : "❌ Out of stock"}
        </p>
  
        <PricingPlans
          plans={pricingOptions}
          selectedPlan={selectedPlan}
          onPlanSelect={setSelectedPlan}
        />
        <ActionSection product={productVariant} />
  
        <div className={styles.trustBadges}>
          <div>✅ 100% Ayurvedic Formulation</div>
          <div>🔬 Lab-Tested For Purity</div>
          <div>🌿 Certified Organic Products</div>
          <div>❌ No Artificial Flavors</div>
        </div>
      </div>
  );
}