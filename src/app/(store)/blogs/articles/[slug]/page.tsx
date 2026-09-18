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
  faqs?: FaqItem[];
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
    processed = processed.replace(/^\s*<h1[^>]*>([\s\S]*?)<\/h1>/i, (match, innerText) => {
      const strippedInner = innerText.replace(/<[^>]*>/g, "").trim().toLowerCase();
      if (
        strippedInner === cleanTitle ||
        strippedInner.includes(cleanTitle) ||
        cleanTitle.includes(strippedInner)
      ) {
        return "";
      }
      return `<h2 class="${styles.articleHeading}">${innerText}</h2>`;
    });
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

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>·</span>
          <Link href="/blogs/articles">Articles</Link>
          <span>·</span>
          <span aria-current="page">{article.breadcrumbTitle || article.title}</span>
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