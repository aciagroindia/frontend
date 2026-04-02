import ProductDetail from "../../../../../components/product/ProductDetail";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}