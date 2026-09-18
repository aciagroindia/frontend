import CollectionLayout from "../../../../../components/collection/CollectionLayout";
import { notFound } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

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
    const title = `${category.name} | ACI Agro Solutions`;
    const plainDesc = category.description
      ? category.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)
      : `Explore our authentic range of ${category.name} products at ACI Agro Solutions.`;

    return {
      title,
      description: plainDesc,
      alternates: {
        canonical: `https://aciagro.com/collections/${category.slug}`,
      },
      openGraph: {
        title,
        description: plainDesc,
        url: `https://aciagro.com/collections/${category.slug}`,
        siteName: "ACI Agro Solutions",
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
    const productsRes = await axiosInstance.get(`/products?category=${category._id}`);
    const rawProducts = Array.isArray(productsRes.data) ? productsRes.data : [];
    const products: Product[] = rawProducts
      .filter((p: any) => p && p.status === "Active")
      .map((p: any) => ({
        ...p,
        id: p._id,
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