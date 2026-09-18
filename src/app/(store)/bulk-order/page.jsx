import React from "react";
import BulkIntro from "../../../../components/BulkOrder/BulkIntro/page.jsx";
import OrderForm from "../../../../components/BulkOrder/OrderForm/page.tsx";

export const metadata = {
  title: "Bulk Orders | ACI Agro Solutions",
  description: "Exclusive bulk order options for premium Ayurvedic and herbal wellness products for retailers, wellness centers, and distributors at ACI Agro Solutions.",
  alternates: {
    canonical: "https://aciagro.com/bulk-order",
  },
  openGraph: {
    title: "Bulk Orders | ACI Agro Solutions",
    description: "Exclusive bulk order options for premium Ayurvedic and herbal wellness products for retailers, wellness centers, and distributors at ACI Agro Solutions.",
    url: "https://aciagro.com/bulk-order",
    siteName: "ACI Agro Solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Orders | ACI Agro Solutions",
    description: "Exclusive bulk order options for premium Ayurvedic and herbal wellness products for retailers, wellness centers, and distributors at ACI Agro Solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BulkOrderPage() {
  return (
    <>
      <BulkIntro />
      <OrderForm />
    </>
  );
}
