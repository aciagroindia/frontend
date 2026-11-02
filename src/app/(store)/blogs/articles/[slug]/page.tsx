import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./Article.module.css";
import axiosInstance from "@/utils/axiosInstance";

const SITE_URL = "https://aciagro.com";

interface FaqItem {
  question: string;
  answer: string;
}

interface ArticleData {
  _id?: string;
  title: string;
  slug: string;
  breadcrumbTitle?: string;
  description?: string;
  image?: string;
  content: string;
  status?: string;
  category?: string;
  faqs?: FaqItem[];
  buttonText?: string;
  buttonUrl?: string;
  createdAt?: string;
}

async function getArticle(slug: string): Promise<ArticleData | null> {
  try {
    const res = await axiosInstance.get(`/articles/${slug}`);

    if (!res.data?.success || !res.data?.data) {
      return null;
    }

    const article: ArticleData = res.data.data;

    if (article.status && article.status !== "Published") {
      return null;
    }

    return article;
  } catch (err) {
    return null;
  }
}

// Fetch published articles for internal linking
async function getRelatedArticles(
  currentArticle: ArticleData
): Promise<ArticleData[]> {
  try {
    const res = await axiosInstance.get("/articles?limit=50");

    const articles: ArticleData[] = Array.isArray(res.data?.data)
      ? res.data.data
      : [];

    const publishedArticles = articles.filter(
      (item) =>
        item?.slug &&
        item.slug !== currentArticle.slug &&
        (!item.status || item.status === "Published")
    );

    const sameCategory = currentArticle.category
      ? publishedArticles.filter(
          (item) => item.category === currentArticle.category
        )
      : [];

    const otherArticles = publishedArticles.filter(
      (item) => !sameCategory.some((related) => related.slug === item.slug)
    );

    return [...sameCategory, ...otherArticles].slice(0, 3);
  } catch (error) {
    console.error("Related articles fetch failed:", error);
    return [];
  }
}

function stripHtml(html: string) {
  if (!html) return "";

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const processArticleContent = (htmlContent: string, articleTitle?: string) => {
  if (!htmlContent) return "";

  let processed = htmlContent;

  if (articleTitle) {
    const cleanTitle = articleTitle.trim().toLowerCase();

    processed = processed.replace(
      /^\s*<h1[^>]*>([\s\S]*?)<\/h1>/i,
      (match, innerText) => {
        const strippedInner = innerText
          .replace(/<[^>]*>/g, "")
          .trim()
          .toLowerCase();

        if (
          strippedInner === cleanTitle ||
          strippedInner.includes(cleanTitle) ||
          cleanTitle.includes(strippedInner)
        ) {
          return "";
        }

        return `<h2 class="${styles.articleHeading}">${innerText}</h2>`;
      }
    );
  }

  processed = processed.replace(
    /<h1[^>]*>([\s\S]*?)<\/h1>/gi,
    '<h2 class="' + styles.articleHeading + '">$1</h2>'
  );

  return processed
    .replace(
      /<p>\s*<(?:strong|b)>(.*?)<\/(?:strong|b)>\s*<\/p>/gi,
      '<h2 class="' + styles.articleHeading + '">$1</h2>'
    )
    .replace(
      /<div>\s*<(?:strong|b)>(.*?)<\/(?:strong|b)>\s*<\/div>/gi,
      '<h2 class="' + styles.articleHeading + '">$1</h2>'
    );
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {};
  }

  const title = `${article.title} | ACI Agro Solutions`;

  const plainDesc = article.description
    ? stripHtml(article.description).slice(0, 160)
    : `Read about ${article.title} on ACI Agro Solutions.`;

  const canonicalUrl = `${SITE_URL}/blogs/articles/${article.slug}`;

  return {
    title,
    description: plainDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: plainDesc,
      url: canonicalUrl,
      siteName: "ACI Agro Solutions",
      type: "article",
      images: article.image
        ? [
            {
              url: article.image,
              alt: article.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: plainDesc,
      images: article.image ? [article.image] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    return notFound();
  }

  // Fetch related published articles
  const relatedArticles = await getRelatedArticles(article);

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Article structured data (JSON-LD)
  const articleUrl = `${SITE_URL}/blogs/articles/${article.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description
      ? stripHtml(article.description)
      : `Read about ${article.title} on ACI Agro Solutions.`,
    url: articleUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(article.image ? { image: [article.image] } : {}),
    ...(article.createdAt ? { datePublished: article.createdAt } : {}),
    author: {
      "@type": "Organization",
      name: "ACI Agro Solutions",
    },
    publisher: {
      "@type": "Organization",
      name: "ACI Agro Solutions",
      url: SITE_URL,
    },
  };

  // Validate external button URL
  let externalButtonUrl = "";

  if (article.buttonText?.trim() && article.buttonUrl?.trim()) {
    try {
      const parsedUrl = new URL(article.buttonUrl.trim());

      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        externalButtonUrl = parsedUrl.toString();
      }
    } catch {
      externalButtonUrl = "";
    }
  }

  return (
    <main className={styles.pageWrapper}>
      {/* ARTICLE STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className={styles.container}>
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>·</span>
          <Link href="/blogs/articles">Articles</Link>
          <span>·</span>
          <span aria-current="page">
            {article.breadcrumbTitle || article.title}
          </span>
        </nav>

        {/* HERO / MAIN IMAGE */}
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
            dangerouslySetInnerHTML={{
              __html: processArticleContent(article.content, article.title),
            }}
          />

          {/* FAQs & ANSWERS SECTION */}
          {article.faqs && article.faqs.length > 0 && (
            <div className={styles.faqSection}>
              <h2 className={styles.faqHeading}>
                Frequently Asked Questions
              </h2>

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

          {/* OPTIONAL EXTERNAL BUTTON */}
          {externalButtonUrl && (
            <div style={{ marginTop: "32px", textAlign: "center" }}>
              <a
                href={externalButtonUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "13px 30px",
                  backgroundColor: "#123F2A",
                  color: "#FFFFFF",
                  border: "1px solid #C5A45D",
                  borderRadius: "6px",
                  fontSize: "15px",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
              >
                {article.buttonText}
              </a>
            </div>
          )}

          {/* RELATED ARTICLES - INTERNAL LINKS */}
          {relatedArticles.length > 0 && (
            <section
              className={styles.relatedSection}
              aria-label="Related articles"
            >
              <h2 className={styles.relatedHeading}>Related Articles</h2>

              <div className={styles.relatedGrid}>
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blogs/articles/${related.slug}`}
                    className={styles.relatedCard}
                  >
                    {related.image && (
                      <div className={styles.relatedImageWrapper}>
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                          className={styles.relatedImage}
                        />
                      </div>
                    )}

                    <div className={styles.relatedCardBody}>
                      <h3 className={styles.relatedCardTitle}>
                        {related.title}
                      </h3>

                      {related.description && (
                        <p className={styles.relatedCardDescription}>
                          {stripHtml(related.description).slice(0, 110)}
                          {stripHtml(related.description).length > 110
                            ? "..."
                            : ""}
                        </p>
                      )}

                      <span className={styles.relatedReadMore}>
                        Read Article →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
