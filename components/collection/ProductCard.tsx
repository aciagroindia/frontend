"use client";

import { useState } from "react";
import styles from "./ProductCard.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Router import kiya
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext"; // 2. Auth hook import kiya
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: {
    id: string; // Product ID
    _id?: string; // MongoDB ID support
    name: string;
    price: number;
    image: string;
    slug: string;
    images?: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth(); // 3. Login status check karne ke liye
  const [isHovered, setIsHovered] = useState(false);

  // ID normalize karne ke liye helper
  const productId = product._id || product.id;

  // Context se normalized image hi use karein
  const mainImage = product.image;

  const handleAddToCart = async () => {
    // Check agar user login nahi hai
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    // Agar login hai toh Context wala function API call karega
    await addToCart(product, 1);
  };

  const handleWishlist = async () => {
    // Check agar user login nahi hai
    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist");
      router.push("/login");
      return;
    }
    await toggleWishlist(product);
  };

  const inWishlist = isInWishlist(productId);

  return (
    <div className={styles.card}>
      
      {/* Wishlist Icon */}
      <div
        className={`${styles.wishlist} ${
          inWishlist ? styles.activeWishlist : ""
        }`}
        onClick={handleWishlist}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? "#e8f5ec" : undefined,
          color: isHovered || inWishlist ? "#1b7f3c" : undefined,
        }}
      >
        <Heart size={18} fill={inWishlist ? "#1b7f3c" : "none"} />
      </div>

      <Link href={`/products/${product.slug}`} className={styles.imageWrapper}>
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.productImage}
            priority={false}
          />
        ) : (
          <div className={styles.placeholder}>No Image Available</div>
        )}
      </Link>

      <div className={styles.cardBody}>
        <Link
          href={`/products/${product.slug}`}
          className={styles.productTitle}
        >
          <h3>{product.name}</h3>
        </Link>

        <p className={styles.price}>₹{product.price.toFixed(2)}</p>
        <div className={styles.stars}>★★★★★</div>

        <button className={styles.button} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}