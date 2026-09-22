"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import styles from "./ProductTabs.module.css";
import { CheckCircle2, Leaf, HelpCircle, Star, MessageSquare, Info, ShieldCheck } from "lucide-react";

interface Props {
  product: any;
  onReviewSubmit?: () => void;
}

interface ParsedSection {
  id: string;
  title: string;
  content: string;
  type: "overview" | "benefits" | "ingredients" | "usage" | "general";
}

/**
 * Parses raw text/HTML or structured sections into clean tab content blocks
 */
function parseProductSections(product: any): ParsedSection[] {
  const sections: ParsedSection[] = [];

  // Case 1: Structured descriptionSections array exists
  if (Array.isArray(product?.descriptionSections) && product.descriptionSections.length > 0) {
    product.descriptionSections.forEach((sec: any, idx: number) => {
      const rawTitle = (sec.title || "").trim();
      const content = (sec.content || "").trim();
      if (!content && !rawTitle) return;

      const lower = rawTitle.toLowerCase();
      let type: ParsedSection["type"] = "general";
      if (lower.includes("benefit")) type = "benefits";
      else if (lower.includes("ingredient")) type = "ingredients";
      else if (lower.includes("use") || lower.includes("direction") || lower.includes("dosage")) type = "usage";
      else if (lower.includes("overview") || lower.includes("about") || lower.includes("description")) type = "overview";

      sections.push({
        id: `sec-${idx}`,
        title: rawTitle || (idx === 0 ? "Description" : `Section ${idx + 1}`),
        content,
        type,
      });
    });

    if (sections.length > 0) return sections;
  }

  // Case 2: Parse raw string description
  const rawDesc = product?.description || "";
  if (!rawDesc) {
    return [
      {
        id: "overview",
        title: "Description",
        content: "100% pure authentic Ayurvedic formulation crafted with natural herbal ingredients.",
        type: "overview",
      },
    ];
  }

  // Normalize HTML
  const clean = rawDesc
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/?strong>/gi, "")
    .replace(/<\/?b>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();

  const headerRegex = /(?:^|\n)\s*(Ingredients|Key Ingredients|Active Ingredients|Key Benefits & Features|Key Benefits|Benefits|Product Benefits|Directions of Use|Directions for Use|Suggested Use|How to Use|Usage|Product Overview|Product Description|About the Product|Storage Instructions|Safety Information)\s*(?::|-)?\s*/gi;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let currentHeading: string | undefined = undefined;

  while ((match = headerRegex.exec(clean)) !== null) {
    const textBefore = clean.substring(lastIndex, match.index).trim();
    if (textBefore || currentHeading) {
      const lower = (currentHeading || "").toLowerCase();
      let type: ParsedSection["type"] = "general";
      if (lower.includes("benefit")) type = "benefits";
      else if (lower.includes("ingredient")) type = "ingredients";
      else if (lower.includes("use") || lower.includes("direction") || lower.includes("dosage")) type = "usage";
      else if (lower.includes("overview") || lower.includes("about") || lower.includes("description")) type = "overview";

      sections.push({
        id: `parsed-${sections.length}`,
        title: currentHeading || "Description",
        content: textBefore,
        type,
      });
    }
    currentHeading = match[1].trim();
    lastIndex = headerRegex.lastIndex;
  }

  const remaining = clean.substring(lastIndex).trim();
  if (remaining || currentHeading) {
    const lower = (currentHeading || "").toLowerCase();
    let type: ParsedSection["type"] = "general";
    if (lower.includes("benefit")) type = "benefits";
    else if (lower.includes("ingredient")) type = "ingredients";
    else if (lower.includes("use") || lower.includes("direction") || lower.includes("dosage")) type = "usage";
    else if (lower.includes("overview") || lower.includes("about") || lower.includes("description")) type = "overview";

    sections.push({
      id: `parsed-${sections.length}`,
      title: currentHeading || "Description",
      content: remaining,
      type,
    });
  }

  if (sections.length === 0) {
    sections.push({
      id: "overview",
      title: "Description",
      content: clean,
      type: "overview",
    });
  }

  return sections.filter((s) => s.content.length > 0);
}

export default function ProductTabs({ product, onReviewSubmit }: Props) {
  const parsedSections = useMemo(() => parseProductSections(product), [product]);

  // Tab definitions: Dynamic section tabs + FAQs + Reviews
  const tabs = useMemo(() => {
    const list: { id: string; label: string; icon?: string; badge?: string | number }[] = [];

    parsedSections.forEach((sec) => {
      list.push({
        id: sec.id,
        label: sec.title,
      });
    });

    // FAQs tab (always available or highlighted if FAQs exist)
    const faqCount = Array.isArray(product?.faqs) ? product.faqs.length : 0;
    list.push({
      id: "faqs",
      label: "FAQs",
      badge: faqCount > 0 ? faqCount : undefined,
    });

    // Reviews tab
    const reviewCount = product?.numReviews || 0;
    list.push({
      id: "reviews",
      label: "Customer Reviews",
      badge: reviewCount > 0 ? reviewCount : undefined,
    });

    return list;
  }, [parsedSections, product?.faqs, product?.numReviews]);

  const [activeTab, setActiveTab] = useState<string>(() => tabs[0]?.id || "faqs");

  // Keep active tab valid if tabs change
  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab(tabs[0]?.id || "faqs");
    }
  }, [tabs, activeTab]);

  // FAQ open/close accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Review states
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === "reviews" && product?._id) {
      fetchReviews();
    }
  }, [activeTab, product?._id]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const { data } = await axiosInstance.get(`/reviews/${product._id}`);
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to submit a review.");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axiosInstance.post("/reviews", {
        productId: product._id,
        rating,
        comment: reviewText,
      });

      if (data.success) {
        toast.success("Review submitted successfully!");
        setRating(0);
        setHoverRating(0);
        setReviewText("");
        fetchReviews();
        if (onReviewSubmit) {
          onReviewSubmit();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Navigation Tab Bar - Horizontal scrollable on mobile */}
      <div className={styles.tabHeaderContainer}>
        <div className={styles.tabHeaders} role="tablist" aria-label="Product Information">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                className={`${styles.tabBtn} ${isActive ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`${styles.badge} ${isActive ? styles.badgeActive : ""}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content Card */}
      <div className={styles.tabContentCard}>
        {/* Render Parsed Dynamic Content Sections */}
        {parsedSections.map((sec) => {
          const isSelected = activeTab === sec.id;
          return (
            <div
              key={sec.id}
              id={`panel-${sec.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${sec.id}`}
              className={`${styles.tabPanel} ${isSelected ? styles.panelVisible : styles.panelHidden}`}
            >
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  {sec.type === "benefits" ? (
                    <CheckCircle2 size={22} className={styles.iconGreen} />
                  ) : sec.type === "ingredients" ? (
                    <Leaf size={22} className={styles.iconGreen} />
                  ) : sec.type === "usage" ? (
                    <Info size={22} className={styles.iconGreen} />
                  ) : (
                    <ShieldCheck size={22} className={styles.iconGreen} />
                  )}
                </div>
                <h2 className={styles.tabSectionHeading}>{sec.title}</h2>
              </div>

              {/* Formatted Content according to section type */}
              {sec.type === "benefits" ? (
                <div className={styles.benefitsGrid}>
                  {sec.content
                    .split(/\n|•|\*/)
                    .map((item) => item.trim())
                    .filter(Boolean)
                    .map((benefit, bIdx) => (
                      <div key={bIdx} className={styles.benefitCard}>
                        <span className={styles.benefitBullet}>✓</span>
                        <p className={styles.benefitText}>{benefit}</p>
                      </div>
                    ))}
                </div>
              ) : sec.type === "ingredients" ? (
                <div className={styles.ingredientsWrapper}>
                  <div className={styles.ingredientsBox}>
                    <div className={styles.ingredientsGrid}>
                      {sec.content
                        .split(/\n|,|;/)
                        .map((item) => item.trim())
                        .filter(Boolean)
                        .map((ing, iIdx) => (
                          <div key={iIdx} className={styles.ingredientTag}>
                            <span className={styles.leafBullet}>🌿</span>
                            <span>{ing}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.textContent}>
                  {sec.content
                    .split("\n\n")
                    .map((para, pIdx) => (
                      <p key={pIdx} className={styles.paragraph}>
                        {para}
                      </p>
                    ))}
                </div>
              )}
            </div>
          );
        })}

        {/* FAQs Tab Panel */}
        <div
          id="panel-faqs"
          role="tabpanel"
          aria-labelledby="tab-faqs"
          className={`${styles.tabPanel} ${activeTab === "faqs" ? styles.panelVisible : styles.panelHidden}`}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <HelpCircle size={22} className={styles.iconGreen} />
            </div>
            <h2 className={styles.tabSectionHeading}>Frequently Asked Questions</h2>
          </div>

          {Array.isArray(product.faqs) && product.faqs.length > 0 ? (
            <div className={styles.faqAccordion}>
              {product.faqs.map((faq: any, index: number) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ""}`}>
                    <button
                      type="button"
                      className={styles.faqHeaderBtn}
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.faqNumber}>Q{index + 1}.</span>
                      <h3 className={styles.faqQuestion}>{faq.question}</h3>
                      <span className={styles.faqToggleIcon}>{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className={styles.faqAnswerBox}>
                        <p className={styles.faqAnswer}>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyNotice}>
              <p>No frequently asked questions listed for this product yet.</p>
            </div>
          )}
        </div>

        {/* Customer Reviews Tab Panel */}
        <div
          id="panel-reviews"
          role="tabpanel"
          aria-labelledby="tab-reviews"
          className={`${styles.tabPanel} ${activeTab === "reviews" ? styles.panelVisible : styles.panelHidden}`}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <MessageSquare size={22} className={styles.iconGreen} />
            </div>
            <h2 className={styles.tabSectionHeading}>Customer Reviews & Ratings</h2>
          </div>

          {/* Rating Snapshot Banner */}
          <div className={styles.ratingBanner}>
            <div className={styles.ratingScoreBox}>
              <div className={styles.bigScore}>
                {product.rating ? Number(product.rating).toFixed(1) : "5.0"}
              </div>
              <div className={styles.starsRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      color: i < Math.round(product.rating || 5) ? "#1b7f3c" : "#e5e7eb",
                      fontSize: "18px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className={styles.totalReviewsCount}>
                Based on {product.numReviews || 0} authentic reviews
              </div>
            </div>
          </div>

          {/* Write a review form */}
          <div className={styles.reviewFormCard}>
            <h3 className={styles.formTitle}>Write a Verified Customer Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Rating (Out of 5 Stars)</label>
                <div className={styles.starRatingInput}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={styles.starBtn}
                      onClick={() => setRating(star)}
                      onMouseOver={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${star} star`}
                    >
                      <span
                        style={{
                          color: star <= (hoverRating || rating) ? "#1b7f3c" : "#d1d5db",
                        }}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="reviewText" className={styles.formLabel}>
                  Your Experience / Feedback
                </label>
                <textarea
                  id="reviewText"
                  className={styles.textarea}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about how this product helped you..."
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Submitting Review..." : "Submit Review"}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className={styles.reviewsContainer}>
            {loadingReviews ? (
              <div className={styles.loadingNotice}>Loading customer reviews...</div>
            ) : reviews.length > 0 ? (
              <div className={styles.reviewsList}>
                {reviews.map((rev: any) => (
                  <div key={rev._id} className={styles.reviewCard}>
                    <div className={styles.avatar}>
                      {rev.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className={styles.reviewBody}>
                      <div className={styles.reviewMeta}>
                        <span className={styles.reviewerName}>{rev.name}</span>
                        <span className={styles.reviewStars}>
                          {"★".repeat(rev.rating)}
                          {"☆".repeat(5 - rev.rating)}
                        </span>
                      </div>
                      <p className={styles.reviewComment}>"{rev.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyNotice}>
                <p>No customer reviews yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
