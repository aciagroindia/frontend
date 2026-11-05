import CollectionLayout from "../../../../../components/collection/CollectionLayout";
import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { titleToString } from "@/utils/seoTitle";
import { toJsonLd, breadcrumbJsonLd } from "@/utils/jsonLd";
import { JUICE_TOPICS, getJuiceTopic } from "@/utils/juiceTopics";

// Keyword landing pages (/juices/noni-juice, /juices/detox-juice ...).
// Products API se aate hain aur topic ke naam-match se filter hote hain.
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return JUICE_TOPICS.map((t: { slug: string }) => ({ topic: t.slug }));
}

const SITE_URL = "https://aciagro.com";

// Saare Active products (Data Cache mein 1 ghanta, sab pages ke liye ek hi call)
const getActiveProducts = cache(async (): Promise<any[]> => {
  try {
    const base = axiosInstance.defaults.baseURL;
    const res = await fetch(`${base}/products?status=Active`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.data || [];
    return list.filter((p: any) => p && p.slug && p.status === "Active");
  } catch {
    return [];
  }
});

const getBestSellers = cache(async (): Promise<any[]> => {
  try {
    const base = axiosInstance.defaults.baseURL;
    const res = await fetch(`${base}/products/best-sellers`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.success && Array.isArray(data.products) ? data.products : [];
  } catch {
    return [];
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const t = getJuiceTopic(topic);
  if (!t) return {};

  const url = `${SITE_URL}/juices/${t.slug}`;
  const fullTitle = titleToString(t.seoTitle);

  return {
    title: t.seoTitle, // layout ka template " | ACI Agro Solution" khud jodta hai
    description: t.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: t.metaDescription,
      url,
      siteName: "ACI Agro Solution",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "ACI Agro Solution - Ayurvedic and Herbal Wellness",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: t.metaDescription,
      images: [`${SITE_URL}/og-image.png`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function JuiceTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const t = getJuiceTopic(topic);
  if (!t) return notFound();

  const [allProducts, bestSellers] = await Promise.all([
    getActiveProducts(),
    getBestSellers(),
  ]);

  const matched = allProducts
    .filter((p: any) => t.test(String(p.name || "")))
    .map((p: any) => ({
      ...p,
      id: p._id,
      stock:
        p.stock !== undefined && p.stock !== null ? Number(p.stock) : 0,
      status: p.status || "Active",
    }));

  // Koi product match na ho toh khali (thin) page index na ho
  if (matched.length === 0) return notFound();

  const url = `${SITE_URL}/juices/${t.slug}`;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.h1,
    url,
    numberOfItems: matched.length,
    itemListElement: matched.map((p: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      name: p.name,
      url: `${SITE_URL}/products/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd([
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: t.h1, path: `/juices/${t.slug}` },
            ]),
            itemListSchema,
          ]),
        }}
      />
      <CollectionLayout
        title={t.h1}
        description={t.html}
        products={matched}
        bestSellers={bestSellers}
      />
    </>
  );
}
