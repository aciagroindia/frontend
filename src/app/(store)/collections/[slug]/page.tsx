import CollectionLayout from "../../../../../components/collection/CollectionLayout";
import { notFound } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
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
    if (!categoryRes.data.success || !categoryRes.data.data) {
      return notFound();
    }
    const category: Category = categoryRes.data.data;

    // 2. Fetch products by category ID
    const productsRes = await axiosInstance.get(`/products?category=${category._id}`);
    const products: Product[] = productsRes.data.map((p: any) => ({
      ...p,
      id: p._id, // Add id field for compatibility with frontend components
    }));

    return (
      <CollectionLayout
        title={category.name}
        description={category.description}
        products={products}
      />
    );
  } catch (error) {
    console.error("Error fetching collection data:", error);
    return notFound();
  }
}