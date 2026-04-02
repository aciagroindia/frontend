"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Whichlist.module.css";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useProducts } from "../../context/ProductContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

export default function WishlistItem({ product: wishlistProduct }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const { products: allProducts } = useProducts();

  // Find the full product from the global context to ensure all data (like the correct image URL) is available.
  const product = allProducts.find(p => p.id === wishlistProduct.id) || wishlistProduct;

  const handleAddToCart = () => {
    // The 'product' object here is now the full product object from ProductContext.
    addToCart(product);
    toggleWishlist(product);
  };

  const handleRemove = () => {
    // toggleWishlist works with the product id, so it's safe.
    toggleWishlist(product);
  };

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.imageWrapper}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={styles.image}
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
        )}
      </Link>

      <div className={styles.content}>
        <Link href={`/products/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className={styles.price}>₹{product.price}</p>

        <div className={styles.actions}>
          <button onClick={handleAddToCart} className={styles.cartBtn}>
            Add to Cart
          </button>
          <button onClick={handleRemove} className={styles.removeBtn}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}