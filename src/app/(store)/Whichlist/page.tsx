"use client";

import styles from "./whichlist.module.css";
import WishlistItem from "../../../../components/Whichlist/Wishlist";
import { useWishlist } from "../../../../context/WishlistContext";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Wishlist 🌿</h1>

      {wishlist.length === 0 ? (
        <p className={styles.empty}>Your wishlist is empty.</p>
      ) : (
        <div className={styles.grid}>
          {wishlist.map((product) => (
            <WishlistItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}