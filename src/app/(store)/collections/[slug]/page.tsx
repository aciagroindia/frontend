import CollectionLayout from "../../../../../components/collection/CollectionLayout";
import { notFound } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

export const revalidate = 60;

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
    const categoryRes = await axiosInstance.get(`/categories/${slug}`);

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

    const title = `${cleanCategoryName} | ${BRAND_NAME}`;

    const plainDesc = category.description
      ? category.description
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 160)
      : `Explore our authentic range of ${cleanCategoryName} products at ACI Agro Solutions.`;

    const canonicalUrl = `https://aciagro.com/collections/${category.slug}`;

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
        siteName: BRAND_NAME,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: plainDesc,
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
    const categoryRes = await axiosInstance.get(`/categories/${slug}`);

    if (!categoryRes.data?.success || !categoryRes.data?.data) {
      return notFound();
    }

    const category: Category = categoryRes.data.data;

    if (category.status && category.status !== "Active") {
      return notFound();
    }

    // 2. Fetch products by category ID
    const productsRes = await axiosInstance.get(
      `/products?category=${category._id}&status=all`
    );

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

    return (
      <CollectionLayout
        title={category.name}
        description={category.description}
        products={products}
      />
    );
  } catch (error) {
    return notFound();
  }
}
