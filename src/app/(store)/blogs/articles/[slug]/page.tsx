"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Article.module.css";
import axiosInstance from "@/utils/axiosInstance";

interface FaqItem {
  question: string;
  answer: string;
}

interface ArticleData {
  _id?: string;
  title: string;
  slug: string;
  breadcrumbTitle?: string;
  image?: string;
  content: string;
  faqs?: FaqItem[];
  createdAt?: string;
}

// Transform standalone bold lines into prominent headings, while leaving inline bold intact
const processArticleContent = (htmlContent: string) => {
  if (!htmlContent) return "";
  return htmlContent
    // Standalone <p><strong>Heading</strong></p> or <p><b>Heading</b></p> -> <h2>
    .replace(/<p>\s*<(?:strong|b)>(.*?)<\/(?:strong|b)>\s*<\/p>/gi, '<h2 class="' + styles.articleHeading + '">$1</h2>')
    // Standalone <div><strong>Heading</strong></div> -> <h2>
    .replace(/<div>\s*<(?:strong|b)>(.*?)<\/(?:strong|b)>\s*<\/div>/gi, '<h2 class="' + styles.articleHeading + '">$1</h2>');
};

export default function ArticleDetailPage({
  params
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const slug = resolvedParams.slug;

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLiveArticle = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await axiosInstance.get(`/articles/${slug}`);
        if (res.data.success && res.data.data) {
          setArticle(res.data.data);
        } else {
          setError(true);
        }
      } catch (err: any) {
        console.warn("Could not fetch live article:", err?.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchLiveArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}>
            <p>Loading article...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <h1 style={{ fontSize: "1.8rem", color: "#1e293b", marginBottom: "12px" }}>Article Not Found</h1>
            <p style={{ color: "#64748b", marginBottom: "25px" }}>The requested article could not be found or has been moved.</p>
            <Link 
              href="/blogs/articles"
              style={{
                display: "inline-block",
                padding: "10px 24px",
                background: "#0f5132",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              ← Back to All Articles
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "";

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* BREADCRUMB */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>·</span>
          <Link href="/blogs/articles">Articles</Link>
          <span>·</span>
          <span>{article.breadcrumbTitle || article.title}</span>
        </nav>

        {/* HERO / MAIN IMAGE (No crop, full width responsive container) */}
        {article.image && (
          <div className={styles.imageWrapper}>
            <Image
              src={article.image}
              alt={article.title}
              fill
              className={styles.image}
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        {/* ARTICLE CONTENT */}
        <div className={styles.contentContainer}>
          {formattedDate && (
            <div className={styles.dateLabel}>{formattedDate}</div>
          )}

          <h1 className={styles.mainTitle}>{article.title}</h1>

          {/* RICH ARTICLE BODY */}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: processArticleContent(article.content) }}
          />

          {/* FAQs & ANSWERS SECTION */}
          {article.faqs && article.faqs.length > 0 && (
            <div className={styles.faqSection}>
              <h2 className={styles.faqHeading}>Frequently Asked Questions</h2>
              <div className={styles.faqList}>
                {article.faqs.map((faq: FaqItem, index: number) => (
                  <div key={index} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>{faq.question}</h3>
                    <p className={styles.faqAnswer}>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}