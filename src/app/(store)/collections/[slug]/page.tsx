import CollectionLayout from "../../../../../components/collection/CollectionLayout";
import { cache } from "react";
import { notFound } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { fitFlexibleTitle, titleToString } from "@/utils/seoTitle";

export const revalidate = 60;

// cache(): generateMetadata aur page dono ke liye category ek hi baar fetch hogi
const getCategoryRes = cache((slug: string) =>
  axiosInstance.get(`/categories/${slug}`)
);

// Best sellers sidebar ke liye server par fetch (Data Cache mein 1 ghanta), taaki browser mein alag API call na ho
const getBestSellers = cache(async () => {
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

const BRAND_NAME = "ACI Agro Solutions";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status?: string;
}

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  stock?: number;
  status?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const categoryRes = await getCategoryRes(slug);

    if (!categoryRes.data?.success || !categoryRes.data?.data) {
      return {};
    }

    const category: Category = categoryRes.data.data;

    if (category.status && category.status !== "Active") {
      return {};
    }

    // Preserve all category keywords and remove duplicate brand suffixes.
    const cleanCategoryName = category.name
      .replace(/(\s*\|\s*ACI Agro Solutions)+\s*$/gi, "")
      .trim();

    // Layout ka template brand jodta hai; lamba title ho toh brand hat jata hai (60 char limit)
    const pageTitle = fitFlexibleTitle(cleanCategoryName);
    const title = titleToString(pageTitle);

    const plainDesc = category.description
      ? category.description
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 160)
      : `Explore our authentic range of ${cleanCategoryName} products at ACI Agro Solutions.`;

    const canonicalUrl = `https://aciagro.com/collections/${category.slug}`;

    return {
      title: pageTitle,
      description: plainDesc,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description: plainDesc,
        url: canonicalUrl,
        siteName: BRAND_NAME,
        type: "website",
        images: [
          {
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: "ACI Agro Solutions - Ayurvedic and Herbal Wellness",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: plainDesc,
        images: ["/og-image.png"],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {};
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    // 1. Fetch category by slug
    const categoryRes = await getCategoryRes(slug);

    if (!categoryRes.data?.success || !categoryRes.data?.data) {
      return notFound();
    }

    const category: Category = categoryRes.data.data;

    if (category.status && category.status !== "Active") {
      return notFound();
    }

    // 2. Fetch products by category ID
    const [productsRes, bestSellers] = await Promise.all([
      axiosInstance.get(`/products?category=${category._id}&status=all`),
      getBestSellers(),
    ]);

    const rawProducts = Array.isArray(productsRes.data)
      ? productsRes.data
      : [];

    const products: Product[] = rawProducts.map((p: any) => ({
      ...p,
      id: p._id,
      stock:
        p.stock !== undefined && p.stock !== null
          ? Number(p.stock)
          : 0,
      status: p.status || "Active",
    }));

    // Category ItemList structured data
    const categoryUrl = `https://aciagro.com/collections/${category.slug}`;

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": category.name,
      "description": category.description
        ? category.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
        : `${category.name} products at ACI Agro Solutions.`,
      "url": categoryUrl,
      "numberOfItems": products.filter((product) => product.slug).length,
      "itemListElement": products
        .filter((product) => product.slug)
        .map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": product.name,
          "url": `https://aciagro.com/products/${product.slug}`,
        })),
    };

    return (
      <>
        {/* CATEGORY ITEMLIST STRUCTURED DATA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
          }}
        />

        <CollectionLayout
          title={category.name}
          description={category.description}
          products={products}
          bestSellers={bestSellers}
        />
      </>
    );
  } catch (error) {
    return notFound();
  }
}
