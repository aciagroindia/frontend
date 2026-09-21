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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {};
  }

  const title = `${product.name} | ACI Agro Solutions`;
  const plainDescription = stripHtml(product.description);
  const description = plainDescription
    ? plainDescription.slice(0, 160)
    : "Buy authentic Ayurvedic and herbal wellness products online at ACI Agro Solutions.";

  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;
  const firstImage =
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null) ||
    product.image ||
    null;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ACI Agro Solutions",
      type: "website",
      images: firstImage
        ? [
            {
              url: firstImage,
              alt: product.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: firstImage ? [firstImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return notFound();
  }

  const cleanDescription = stripHtml(product.description);
  const productImage =
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null) ||
    product.image ||
    null;
  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;
  const isAvailable = Number(product.stock) > 0;

  // 1. Product JSON-LD Schema
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": cleanDescription || product.name,
    ...(productImage ? { "image": [productImage] } : {}),
    "brand": {
      "@type": "Brand",
      "name": "ACI Agro Solutions",
    },
    "url": canonicalUrl,
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "price": Number(product.price) || 0,
      "priceCurrency": "INR",
      "availability": isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
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
      <ProductDetail slug={slug} initialProduct={product} />
    </>
  );
}