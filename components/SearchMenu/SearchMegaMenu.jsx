"use client";

import styles from "./SearchMegaMenu.module.css";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "../../context/ProductContext";
import { useCategories } from "../../context/CategoryContext"; // Categories context import kiya
import { useState, useEffect } from "react";

// In a real app, this data would come from an API.
// For now, it's set up to be easily replaced.
const trendingSearches = [
  { name: "Healthy Drinks", href: "/collections/healthy-drinks" },
  { name: "Capsules", href: "/collections/capsules" },
];

// The component now accepts `searchTerm` to filter products and `onResultClick` to handle closing the menu.
export default function SearchMegaMenu({ searchTerm, onResultClick }) {
  const { products = [], loading: productsLoading } = useProducts() || {};
  const { categories = [], loading: categoriesLoading } = useCategories() || {};

  // States to hold filtered results
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  // This effect runs when the search term changes, filtering both products and categories.
  useEffect(() => {
    if (searchTerm && (products.length > 0 || categories.length > 0)) {
      // Filter Products
      const productResults = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(productResults.slice(0, 4));

      // Filter Categories
      const categoryResults = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(categoryResults.slice(0, 3)); // Limit category results

    } else {
      // If there's no search term, clear the results.
      setFilteredProducts([]);
      setFilteredCategories([]);
    }
  }, [searchTerm, products, categories]);

  // We still need popular products for the default view (when not searching).
  const popularProducts = (products || []).slice(0, 3);

  // A simple flag to determine if a search is active.
  const isSearching = searchTerm && searchTerm.length > 0;

  return (
    <div className={styles.megaMenu}>
      <div className={styles.container}>
        {/* DYNAMIC LEFT SECTION: Shows "Trending" or "Categories" */}
        <div className={styles.trendingSection}>
          <h4>{isSearching ? "CATEGORIES" : "TRENDING SEARCH"}</h4>
          <div className={styles.trendingLinks}>
            {isSearching ? (
              categoriesLoading ? (
                <p>Searching...</p>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <Link href={`/collections/${category.slug}`} key={category._id} onClick={onResultClick}>
                    {category.name}
                  </Link>
                ))
              ) : (
                <p style={{ fontSize: '14px', color: '#666' }}>No categories found.</p>
              )
            ) : (
              trendingSearches.map((search) => (
                <Link href={search.href} key={search.name} onClick={onResultClick}>
                  {search.name}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* DYNAMIC PRODUCTS SECTION */}
        <div className={styles.productsSection}>
          {/* The title changes to "SEARCH RESULTS" when the user is typing. */}
          <h4>{isSearching ? "PRODUCT RESULTS" : "POPULAR PRODUCTS"}</h4>
          <div className={styles.productGrid}>
            {productsLoading && !isSearching ? ( // Only show loading for popular products
              <p>Loading...</p>
            ) : isSearching ? (
              // 1. Render Search Results
              productsLoading ? (
                <p>Searching...</p>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Link
                    href={`/products/${product.slug}`}
                    key={product._id}
                    className={styles.cardLink}
                    onClick={onResultClick}
                  >
                    <div className={styles.card}>
                      <div className={styles.imageWrapper}>
                        <Image
                          src={product.image || '/certifiedIcons/product.jpeg'}
                          alt={product.name}
                          fill
                          sizes="(max-width: 1000px) 33vw, 25vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <p>{product.name}</p>
                      {/* Stars are omitted in search results for a cleaner look */}
                    </div>
                  </Link>
                ))
              ) : (
                <p style={{ fontSize: '14px', color: '#666' }}>No products found for "{searchTerm}"</p>
              )
            ) : (
              // 2. Render Popular Products (Default)
              popularProducts.map((product) => (
                <Link
                  href={`/products/${product.slug}`}
                  key={product._id}
                  className={styles.cardLink}
                  onClick={onResultClick}
                >
                  <div className={styles.card}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={product.image || '/certifiedIcons/product.jpeg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 1000px) 33vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <p>{product.name}</p>
                    <div className={styles.stars}>★★★★★</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}