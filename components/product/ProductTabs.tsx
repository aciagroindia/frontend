"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import styles from "./ProductTabs.module.css";

interface Props {
    product: any;
    onReviewSubmit?: () => void;
}

export default function ProductTabs({ product, onReviewSubmit }: Props) {
  const [activeTab, setActiveTab] = useState("faq");
  
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
        fetchReviews(); // Refresh the list
        if (onReviewSubmit) {
          onReviewSubmit(); // Tell the parent to refresh the product data
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
      <div className={styles.tabHeaders}>
        <button
          className={`${styles.tabBtn} ${activeTab === "faq" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("faq")}
        >
          Frequently Asked Questions
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "reviews" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Customer Reviews
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "faq" && (
          <div>
            {product.faqs && product.faqs.length > 0 ? (
                product.faqs.map((faq: any, index: number) => (
                    <div key={index} className={styles.faqItem}>
                        <div className={styles.faqQuestion}>
                            {index + 1}. {faq.question}
                        </div>
                        <div>{faq.answer}</div>
                    </div>
                ))
            ) : (
                <p>No FAQs available for this product.</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h3 className={styles.reviewsHeader}>
              <span className={styles.starGreen}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < Math.round(product.rating || 0) ? "★" : "☆"}
                  </span>
                ))}
              </span>{" "}
              {product.rating ? product.rating.toFixed(1) : "0.0"}/5 (Based on {product.numReviews || 0} reviews)
            </h3>

            {/* Review Submission Form */}
            <div className={styles.reviewForm}>
              <h4>Write a review</h4>
              <form onSubmit={handleReviewSubmit}>
                <div className={styles.formGroup}>
                  <label>Rating</label>
                  <div className={styles.starRatingInput}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={styles.star}
                        onClick={() => setRating(star)}
                        onMouseOver={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          color: star <= (hoverRating || rating) ? "#1a8e5f" : "#e4e5e9",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="reviewText">Review</label>
                  <textarea
                    id="reviewText"
                    className={styles.textarea}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your comments here"
                    required
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>

            <div className={styles.reviewsList}>
              {loadingReviews ? (
                <p>Loading reviews...</p>
              ) : reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <div key={review._id} className={styles.reviewCard}>
                    <div className={styles.avatar}>{review.name?.charAt(0) || "U"}</div>
                    <div className={styles.reviewBody}>
                      <div className={styles.reviewMeta}>
                        <span>{review.name}</span>
                        <span className={styles.reviewStars}>
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className={styles.reviewText}>"{review.comment}"</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
