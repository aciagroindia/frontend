"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import styles from "./ProductInfo.module.css";
import PricingPlans, { Plan } from "./PricingPlans";
import ActionSection from "./ActionSection";

interface Props {
  product: any;
}

interface DescriptionSection {
  heading?: string;
  content: string;
}

/**
 * Parses product description into structured blocks based on real section headings
 * present in the text (e.g. Ingredients, Key Benefits, Directions of Use).
 * If no section headings exist, it returns a single block with no heading.
 */
function parseDescriptionSections(raw: string): DescriptionSection[] {
  if (!raw) return [];

  // Normalize HTML line breaks, bold tags, paragraphs to newlines
  const cleanText = raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/?strong>/gi, "")
    .replace(/<\/?b>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();

  if (!cleanText) return [];

  // Recognize genuine known section headings (at start of line or after newline, followed by optional colon/dash)
  const headerRegex = /(?:^|\n)\s*(Ingredients|Key Ingredients|Active Ingredients|Key Benefits & Features|Key Benefits|Benefits|Product Benefits|Directions of Use|Directions for Use|Suggested Use|How to Use|Usage|Product Overview|Product Description|About the Product|Storage Instructions|Safety Information)\s*(?::|-)?\s*/gi;

  const sections: DescriptionSection[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let currentHeading: string | undefined = undefined;

  while ((match = headerRegex.exec(cleanText)) !== null) {
    const textBefore = cleanText.substring(lastIndex, match.index).trim();
    if (textBefore || currentHeading) {
      sections.push({
        heading: currentHeading,
        content: textBefore,
      });
    }
    currentHeading = match[1].trim();
    lastIndex = headerRegex.lastIndex;
  }

  const remainingText = cleanText.substring(lastIndex).trim();
  if (remainingText || currentHeading) {
    sections.push({
      heading: currentHeading,
      content: remainingText,
    });
  }

  if (sections.length === 0) {
    return [{ heading: "Product Overview", content: cleanText }];
  }

  const filtered = sections.filter((s) => s.content || s.heading);

  // If the introductory block before any subheaders exists and has no heading, assign "Product Overview"
  if (filtered.length > 0 && !filtered[0].heading && filtered[0].content) {
    filtered[0].heading = "Product Overview";
  }

  return filtered;
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

  // Handle case where product data updates or changes (e.g. navigation to new product)
  useEffect(() => {
    if (quantityOptions && quantityOptions.length > 0) {
      setSelectedPlan(quantityOptions[0]);
    }
  }, [product._id, product.id]);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const handleToggleDescription = () => {
    setIsDescriptionExpanded((prev) => {
      const willCollapse = prev;
      if (willCollapse && descriptionRef.current) {
        const rect = descriptionRef.current.getBoundingClientRect();
        if (rect.top < 80) {
          window.scrollTo({
            top: window.scrollY + rect.top - 90,
            behavior: "smooth",
          });
        }
      }
      return !prev;
    });
  };

  const displaySections: DescriptionSection[] = useMemo(() => {
    if (Array.isArray(product.descriptionSections) && product.descriptionSections.length > 0) {
      return product.descriptionSections
        .filter((s: any) => s && (s.title || s.content))
        .map((s: any) => ({
          heading: s.title?.trim() || "Product Overview",
          content: s.content || "",
        }));
    }
    return parseDescriptionSections(product.description || "");
  }, [product.descriptionSections, product.description]);

  const strippedDescription = useMemo(() => {
    if (displaySections.length > 0) {
      return displaySections
        .map((s) => `${s.heading ? s.heading + " " : ""}${s.content}`)
        .join(" ")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
    return product.description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "";
  }, [displaySections, product.description]);

  const shortDescription = useMemo(() => {
    return strippedDescription.slice(0, 100);
  }, [strippedDescription]);

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
        <div className={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              style={{ color: i < Math.round(product.rating || 0) ? "#1b7f3c" : "#ccc" }}
            >
              ★
            </span>
          ))}
        </div>
        <span>({product.numReviews || 0} reviews)</span>
      </div>

      {/* Semantic Description Container (DIV, not P, with H2 headings permanently in DOM for SSR & SEO) */}
      <div
        ref={descriptionRef}
        className={`${styles.description} ${
          !isDescriptionExpanded ? styles.descriptionCollapsed : styles.descriptionExpanded
        }`}
        onClick={handleToggleDescription}
        style={{ cursor: "pointer" }}
        role="button"
        tabIndex={0}
        aria-expanded={isDescriptionExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggleDescription();
          }
        }}
      >
        <div className={styles.descriptionContent}>
          {displaySections.map((sec, idx) => (
            <div key={idx} className={styles.sectionBlock}>
              {sec.heading ? (
                <h2 className={styles.sectionHeading}>{sec.heading}</h2>
              ) : null}
              <p className={styles.descriptionParagraph}>{sec.content}</p>
            </div>
          ))}
        </div>
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
        <div>✅ 100% Ayurvedic Formulation</div>
        <div>🔬 Lab-Tested For Purity</div>
        <div>🌿 Certified Organic Products</div>
        <div>❌ No Artificial Flavors</div>
      </div>
    </div>
  );
}