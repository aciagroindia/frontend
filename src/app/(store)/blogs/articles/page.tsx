"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./BlogPage.module.css";
import axiosInstance from "@/utils/axiosInstance";

interface ArticleItem {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  createdAt?: string;
  category?: string;
}

const formatDate = (isoString?: string) => {
  if (!isoString) return "Recent";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).toUpperCase();
  } catch (e) {
    return "Recent";
  }
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Clear any old mock cache
    if (typeof window !== "undefined") {
      localStorage.removeItem("store_articles");
    }

    const fetchLiveArticles = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/articles?page=${currentPage}&limit=12`);
        if (response.data.success && Array.isArray(response.data.data)) {
          setArticles(response.data.data);
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.pages || 1);
          }
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error("Error fetching articles from live database:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveArticles();
  }, [currentPage]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.heading}>ARTICLES & BLOGS</h1>
          <p className={styles.subtitle}>
            Explore Wellness Tips, Ancient Remedies & Ayurvedic Solutions from our experts.
          </p>
        </div>

        {/* Live Articles Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            <p>Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "80px 20px", 
            background: "#f9fafb", 
            borderRadius: "16px", 
            border: "1px dashed #cbd5e1",
            maxWidth: "650px",
            margin: "0 auto"
          }}>
            <h3 style={{ fontSize: "1.25rem", color: "#1e293b", marginBottom: "8px", fontWeight: 700 }}>
              No Articles Published Yet
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Our Ayurvedic health experts are preparing fresh articles and remedies. Please check back soon or visit our store.
            </p>
            <Link 
              href="/"
              style={{
                display: "inline-block",
                marginTop: "20px",
                padding: "10px 24px",
                background: "#0f5132",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {articles.map((article) => {
              const articleId = article._id || article.id || article.slug;
              const imgSrc = article.image || "/certifiedIcons/product.jpeg";
              const dateStr = formatDate(article.createdAt);

              return (
                <Link 
                  key={articleId} 
                  href={`/blogs/articles/${article.slug}`} 
                  className={styles.card}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={imgSrc}
                      alt={article.title}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className={styles.content}>
                    <span className={styles.date}>{dateStr}</span>
                    <h2 className={styles.title}>{article.title}</h2>
                    <p className={styles.description}>{article.description}</p>
                    <div className={styles.readMore}>
                      Read More <span>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={styles.pageBtn} 
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                className={`${styles.pageBtn} ${currentPage === pg ? styles.active : ""}`}
                onClick={() => setCurrentPage(pg)}
              >
                {pg}
              </button>
            ))}
            <button 
              className={styles.pageBtn} 
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              &gt;
            </button>
          </div>
        )}

      </div>
    </section>
  );
}