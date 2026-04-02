"use client";

import styles from "./MegaMenu.module.css";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "../../context/CategoryContext";
import { useProducts } from "../../context/ProductContext"; // Import useProducts hook

export default function MegaMenu({ onLinkClick }) {
  // FIX: Destructure with default values to prevent crash if context returns null/undefined.
  const { categories = [], loading: categoriesLoading = true } = useCategories() || {};

  // Fetch products from the global product context instead of a separate API call.
  // This centralizes data fetching and ensures consistency.
  // FIX: Destructure with default values to prevent crash if context returns null/undefined.
  const { products = [], loading: productsLoading = true } = useProducts() || {};

  // Select the top 3 products to show as "featured" in the mega menu.
  // FIX: Safely slice products to ensure it's always an array, preventing crashes.
  const featuredProducts = (products || []).slice(0, 3);

  return (
    <div className={styles.megaMenu}>
      <div className={styles.container}>

        {/* LEFT SIDE */}
        <div className={styles.left}>
          
          {/* ✅ ONLY ONE SECTION (Concern) */}
          <div>
            <h4>Shop by Concern</h4>
            <ul>
              {categoriesLoading ? (
                <li className={styles.items}>Loading...</li>
              ) : (
                // FIX: Add safety check before mapping.
                categories && categories.map((cat) => (
                  <li key={cat._id}>
                    <Link href={`/collections/${cat.slug}`} className={styles.items} onClick={onLinkClick}>
                      {cat.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

        </div>

        {/* RIGHT SIDE (UPGRADED) */}
        <div className={styles.right}>

          {productsLoading ? (
            // Optional: Add skeleton loaders here for a better UX
            <p>Loading products...</p>
          ) : (
            // FIX: Add safety check before mapping.
            featuredProducts && featuredProducts.map((product) => (
              // --- FIX: Wrapped card in a <Link> for better navigation and accessibility ---
              <Link href={`/products/${product.slug}`} key={product._id} className={styles.cardLink} onClick={onLinkClick}>
                <div className={styles.card}>
                  {/* --- FIX: Added a wrapper to maintain aspect ratio and prevent shrinking --- */}
                  <div className={styles.imageWrapper}>
                    <Image
                      // Using 'fill' to make the image responsive within the wrapper
                      src={product.image || "/certifiedIcons/product.jpeg"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1000px) 33vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <p>{product.name}</p>
                </div>
              </Link>
            ))
          )}

        </div>

      </div>
    </div>
  );
}