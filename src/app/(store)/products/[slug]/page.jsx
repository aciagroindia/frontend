import { cache } from "react";
import ProductDetail from "../../../../../components/product/ProductDetail";
import { notFound } from "next/navigation";
import Link from "next/link";
import { topicsForProductName } from "@/utils/juiceTopics";
import axiosInstance from "@/utils/axiosInstance";
import { fitProductTitle, titleToString } from "@/utils/seoTitle";
import { cleanProductName } from "@/utils/productName";

export const revalidate = 60;

const SITE_URL = "https://aciagro.com";

const getProduct = cache(async (slug) => {
  if (!slug) return null;
  try {
    const res = await axiosInstance.get(`/products/${encodeURIComponent(slug)}`);
    const product = res.data;
    if (product) return product;
  } catch (err) {
    try {
      const fallbackRes = await axiosInstance.get(`/products/${slug}`);
      if (fallbackRes.data) return fallbackRes.data;
    } catch (e) {
      console.error(`Error fetching product slug ${slug}:`, e.message);
    }
  }
  return null;
});

// Fetch related products on the server for SEO-friendly internal links
const getRelatedProducts = cache(async (slug) => {
  if (!slug) return [];

  try {
    const res = await axiosInstance.get(
      `/products/related/${encodeURIComponent(slug)}`
    );

    if (res.data?.success && Array.isArray(res.data.products)) {
      return res.data.products.filter(
        (product) =>
          product.slug &&
          product.status === "Active" &&
          Number(product.stock) > 0
      );
    }

    return [];
  } catch (error) {
    console.error("Related products fetch failed:", error.message);
    return [];
  }
});

// IMPORTANT (backend load): build ke waqt koi page pre-render nahi hota, isliye Vercel build backend (Render) ko
// hazaron API calls nahi bhejta. Pages pehli baar khulne par bante hain aur phir ISR (revalidate) se cache rehte hain.
// (dynamicParams default true hai, toh sab slugs on-demand chalte hain.)
export async function generateStaticParams() {
  return [];
}

// Saare Active products ki list (Next ke Data Cache mein 1 ghante ke liye, sab pages ke liye ek hi call)
const getAllActiveProducts = cache(async () => {
  try {
    const base = axiosInstance.defaults.baseURL;
    const res = await fetch(`${base}/products?status=Active`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.data || [];
    return list.filter((p) => p && p.slug && p.status === "Active");
  } catch (err) {
    console.error("getAllActiveProducts failed:", err.message);
    return [];
  }
});

// Internal linking: har product ko aglay 4 products (slug order mein, gol ghumte hue) se link milta hai.
// Isse har product page ko kam se kam 4 internal links milte hain, koi page orphan nahi rehta.
function pickNeighborProducts(currentSlug, allProducts, count = 4) {
  const sorted = [...allProducts].sort((a, b) => a.slug.localeCompare(b.slug));
  const total = sorted.length;
  if (total < 2) return [];
  const idx = sorted.findIndex((p) => p.slug === currentSlug);
  const result = [];
  for (let step = 1; step < total && result.length < count; step++) {
    const candidate = sorted[(idx + step + total) % total];
    if (candidate.slug !== currentSlug) result.push(candidate);
  }
  return result;
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getProductDescriptionText(product) {
  if (!product) return "";
  if (product.description) {
    return stripHtml(product.description);
  }
  if (Array.isArray(product.descriptionSections) && product.descriptionSections.length > 0) {
    return product.descriptionSections
      .filter((s) => s && (s.title || s.content))
      .map((s) => `${s.title ? s.title + ": " : ""}${s.content || ""}`)
      .join(" ")
      .trim();
  }
  return "";
}

export async function generateMetadata({ params }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams?.slug;
  if (!slug) return {};

  const product = await getProduct(slug);

  const productName = product?.name || (typeof slug === "string" ? slug.replace(/-/g, " ") : "Ayurvedic Product");
  // Layout ka template " | ACI Agro Solution" khud jodta hai, isliye title mein brand nahi likhte (60 char limit)
  const pageTitle = fitProductTitle(productName);
  const title = titleToString(pageTitle); // openGraph / twitter ke liye brand ke saath
  const plainDescription = getProductDescriptionText(product);
  const description = plainDescription && plainDescription.length > 20
    ? plainDescription.slice(0, 160)
    : `Buy authentic 100% natural and Ayurvedic ${cleanProductName(productName)} online at best price from ACI Agro Solution. Fast shipping across India.`;

  const canonicalUrl = `${SITE_URL}/products/${product?.slug || slug}`;
  const images = (Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : [product?.image]
  ).filter(Boolean);
  const firstImage = images[0] || `${SITE_URL}/og-image.jpg`;

  const keywords = [
    productName,
    product?.category?.name,
    "Ayurvedic products online",
    "Herbal health wellness",
    "ACI Agro Solution",
    "Natural Ayurvedic formulation",
    "Buy Ayurvedic medicine India",
  ].filter(Boolean);

  return {
    title: pageTitle,
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ACI Agro Solution",
      locale: "en_IN",
      type: "website",
      images: images.map((img) => ({
        url: img,
        alt: `${cleanProductName(productName)} - 100% Natural Ayurvedic Formulation`,
        width: 800,
        height: 800,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [firstImage],
      creator: "@ACIAGRO",
      site: "@ACIAGRO",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return notFound();
  }

  // Product aur related products ek saath fetch hote hain (pehle ek ke baad ek hote the)
  const [product, relatedProducts, allProducts] = await Promise.all([
    getProduct(slug),
    getRelatedProducts(slug),
    getAllActiveProducts(),
  ]);

  if (!product) {
    return notFound();
  }

  const moreProducts = pickNeighborProducts(product.slug, allProducts);
  const productTopics = topicsForProductName(product.name);

  const cleanDescription = getProductDescriptionText(product);
  const productImages = (Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image]
  ).filter(Boolean);
  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;
  const isAvailable = product.status === "Active" && Number(product.stock) > 0;
  // Sirf asli reviews hon tabhi rating schema mein jayegi (Google fake/default rating markup par action le sakta hai)
  const hasRealReviews =
    Number(product.rating) > 0 && Number(product.numReviews) > 0;
  const ratingValue = hasRealReviews ? Number(product.rating).toFixed(1) : null;
  const reviewCount = hasRealReviews ? Number(product.numReviews) : null;

  // 1. Enhanced Product JSON-LD Schema
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": cleanProductName(product.name),
    "description": cleanDescription || product.name,
    "sku": String(product._id || product.id || product.slug),
    "mpn": String(product._id || product.slug),
    ...(productImages.length > 0 ? { "image": productImages } : {}),
    "brand": {
      "@type": "Brand",
      "name": "ACI Agro Solution",
    },
    "category": product.category?.name || "Ayurvedic Healthcare",
    "url": canonicalUrl,
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "price": Number(product.price) || 0,
      "priceCurrency": "INR",
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "ACI Agro Solution",
      },
    },
    ...(hasRealReviews
      ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": ratingValue,
            "reviewCount": reviewCount,
            "bestRating": "5",
            "worstRating": "1",
          },
        }
      : {}),
  };

  // 2. BreadcrumbList JSON-LD Schema
  const hasCategorySlug = Boolean(
    product.category &&
      product.category.slug &&
      typeof product.category.slug === "string"
  );

  const breadcrumbElements = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${SITE_URL}/`,
    },
  ];

  if (hasCategorySlug) {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 2,
      "name": product.category.name || "Collections",
      "item": `${SITE_URL}/collections/${product.category.slug}`,
    });
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 3,
      "name": cleanProductName(product.name),
      "item": canonicalUrl,
    });
  } else {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 2,
      "name": cleanProductName(product.name),
      "item": canonicalUrl,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbElements,
  };

  // 3. FAQPage JSON-LD Schema
  let faqJsonLd = null;
  if (Array.isArray(product.faqs) && product.faqs.length > 0) {
    faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": product.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": stripHtml(faq.answer || ""),
        },
      })),
    };
  }

  return (
    <>
      <script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {faqJsonLd ? (
        <script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <ProductDetail
        slug={slug}
        initialProduct={product}
        initialRelatedProducts={relatedProducts}
        initialMoreProducts={moreProducts}
      />

      {/* Internal linking: product se keyword landing pages (/juices/...) */}
      {productTopics.length > 0 && (
        <nav
          aria-label="Explore more juices"
          className="mx-auto max-w-6xl px-4 pb-10 text-sm text-neutral-600"
        >
          Explore more:{" "}
          {productTopics.map((t, i) => (
            <span key={t.slug}>
              {i > 0 && " · "}
              <Link href={`/juices/${t.slug}`} className="underline hover:text-neutral-900">
                {t.h1}
              </Link>
            </span>
          ))}
        </nav>
      )}
    </>
  );
}
