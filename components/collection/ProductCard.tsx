"use client";

import { useState } from "react";
import styles from "./ProductCard.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { Heart } from "lucide-react";
import { cleanProductName } from "@/utils/productName";

interface ProductCardProps {
  product: {
    id: string;
    _id?: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    images?: string[];
    stock?: number;
    status?: string;

    // Real product rating and review count
    rating?: number | string | null;
    numReviews?: number | string | null;
  };
}

// Image alt ke liye saaf naam
function shortAltName(name: string): string {
  return String(name || "")
    .replace(/\(.*?\)/g, "")
    .replace(/aci\s*agro\s*s\w*/gi, "")
    .split(/\s+[-–—|]\s+/)[0]
    .replace(/\s+/g, " ")
    .trim();
}

export default function ProductCard({ product }: ProductCardProps) {
  // Only show stars when actual rating and reviews exist
  const rawRating = Number(product.rating);
  const rawReviewCount = Number(product.numReviews);

  const ratingValue = Number.isFinite(rawRating)
    ? Math.min(5, Math.max(0, rawRating))
    : 0;

  const reviewCount = Number.isFinite(rawReviewCount)
    ? Math.max(0, rawReviewCount)
    : 0;

  const hasRealReviews = ratingValue > 0 && reviewCount > 0;

  const filledStars = Math.min(
    5,
    Math.max(0, Math.round(ratingValue))
  );

  const router = useRouter();

  const { toggleWishlist, isInWishlist } = useWishlist();

  const { isAuthenticated, openLoginModal } = useAuth();

  const [isHovered, setIsHovered] = useState(false);

  // Normalize product ID
  const productId = product._id || product.id;

  // Use normalized image
  const mainImage = product.image;

  const isOutOfStock = Boolean(
    product.status === "Inactive" ||
      (product.stock !== undefined &&
        product.stock !== null &&
        Number(product.stock) <= 0)
  );

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    router.push(`/products/${product.slug || productId}`);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      openLoginModal(async () => {
        await toggleWishlist(product);
      });
      return;
    }

    await toggleWishlist(product);
  };

  const inWishlist = isInWishlist(productId);

  return (
    <div className={styles.card}>
      {/* Out of stock badge */}
      {isOutOfStock && (
        <span className={styles.outOfStockBadge}>
          Out of Stock
        </span>
      )}

      {/* Wishlist Icon */}
      <div
        role="button"
        tabIndex={0}
        aria-label={
          inWishlist
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        className={`${styles.wishlist} ${
          inWishlist ? styles.activeWishlist : ""
        }`}
        onClick={handleWishlist}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleWishlist();
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? "#e8f5ec" : undefined,
          color: isHovered || inWishlist ? "#1b7f3c" : undefined,
        }}
      >
        <Heart
          size={18}
          fill={inWishlist ? "#1b7f3c" : "none"}
        />
      </div>

      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className={styles.imageWrapper}
        prefetch={false}
        aria-label={`View details for ${product.name}`}
      >
        {mainImage ? (
          <Image
            src={mainImage}
            alt={shortAltName(product.name)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.productImage}
            priority={false}
          />
        ) : (
          <div className={styles.placeholder}>
            No Image Available
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className={styles.cardBody}>
        <Link
          href={`/products/${product.slug}`}
          className={styles.productTitle}
          prefetch={false}
          aria-label={cleanProductName(product.name)}
        >
          <span className={styles.productTitleText}>
            {cleanProductName(product.name)}
          </span>
        </Link>

        <p className={styles.price}>
          ₹{product.price.toFixed(2)}
        </p>

        {/* Show only genuine ratings */}
        {hasRealReviews && (
          <div
            className={styles.stars}
            aria-label={`${ratingValue.toFixed(
              1
            )} out of 5 stars from ${reviewCount} reviews`}
          >
            {"★".repeat(filledStars)}
            {"☆".repeat(5 - filledStars)}
          </div>
        )}

        {/* Add to Cart */}
        <button
          className={
            isOutOfStock
              ? styles.disabledButton
              : styles.button
          }
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={
            isOutOfStock
              ? `${product.name} is out of stock`
              : `Add ${product.name} to cart`
          }
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
