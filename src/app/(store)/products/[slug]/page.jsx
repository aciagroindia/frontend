import { cache } from "react";
import ProductDetail from "../../../../../components/product/ProductDetail";
import { notFound } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

export const revalidate = 60;

const SITE_URL = "https://aciagro.com";

const getProduct = cache(async (slug) => {
  try {
    const res = await axiosInstance.get(`/products/${slug}`);
    const product = res.data;
    if (!product || product.status !== "Active") {
      return null;
    }
    return product;
  } catch (err) {
    return null;
  }
});

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
  const { slug } = await params;
  const product = await getProduct(slug);

  const productName = product?.name || (typeof slug === "string" ? slug.replace(/-/g, " ") : "Ayurvedic Product");
  const title = `${productName} - Buy Authentic Ayurvedic Wellness | ACI Agro Solutions`;
  const plainDescription = getProductDescriptionText(product);
  const description = plainDescription && plainDescription.length > 20
    ? plainDescription.slice(0, 160)
    : `Buy authentic 100% natural and Ayurvedic ${productName} online at best price from ACI Agro Solutions. Fast shipping across India.`;

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
    "ACI Agro Solutions",
    "Natural Ayurvedic formulation",
    "Buy Ayurvedic medicine India",
  ].filter(Boolean);

  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ACI Agro Solutions",
      locale: "en_IN",
      type: "website",
      images: images.map((img) => ({
        url: img,
        alt: `${productName} - 100% Natural Ayurvedic Formulation`,
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
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return notFound();
  }

  const cleanDescription = getProductDescriptionText(product);
  const productImages = (Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image]
  ).filter(Boolean);
  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;
  const isAvailable = Number(product.stock) > 0;
  const ratingValue =
    product.rating && Number(product.rating) > 0
      ? Number(product.rating).toFixed(1)
      : "5.0";
  const reviewCount =
    product.numReviews && Number(product.numReviews) > 0
      ? Number(product.numReviews)
      : 1;

  // 1. Enhanced Product JSON-LD Schema (with Rich Snippets, SKU, MPN, AggregateRating)
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": cleanDescription || product.name,
    "sku": String(product._id || product.id || product.slug),
    "mpn": String(product._id || product.slug),
    ...(productImages.length > 0 ? { "image": productImages } : {}),
    "brand": {
      "@type": "Brand",
      "name": "ACI Agro Solutions",
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
        "name": "ACI Agro Solutions",
      },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1",
    },
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
      "name": product.name,
      "item": canonicalUrl,
    });
  } else {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 2,
      "name": product.name,
      "item": canonicalUrl,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbElements,
  };

  // 3. FAQPage JSON-LD Schema (Google Rich FAQ snippets in SERP)
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

  const metaDescription = cleanDescription && cleanDescription.length > 20
    ? cleanDescription.slice(0, 160)
    : `Buy authentic 100% natural and Ayurvedic ${product.name} online at best price from ACI Agro Solutions. Fast shipping across India.`;

  return (
    <>
      <head>
        <meta name="description" content={metaDescription} />
      </head>
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
      <ProductDetail slug={slug} initialProduct={product} />
    </>
  );
}