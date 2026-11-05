import React from "react";
import BulkIntro from "../../../../components/BulkOrder/BulkIntro/page.jsx";
import OrderForm from "../../../../components/BulkOrder/OrderForm/page.tsx";
import B2BFacts from "../../../../components/B2BFacts/B2BFacts";
import Certificates from "../../../../components/Certificates/Certificate";
import { toJsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/utils/jsonLd";

export const metadata = {
  title: "Herbal Juice Bulk Supplier in India",
  description: "Bulk supply of herbal and Ayurvedic juices for retailers, distributors and wholesale buyers in India and abroad. Send your requirement to ACI Agro Solution.",
  alternates: {
    canonical: "https://aciagro.com/bulk-order",
  },
  openGraph: {
    title: "Herbal Juice Bulk Supplier in India | ACI Agro Solution",
    description: "Bulk supply of herbal and Ayurvedic juices for retailers, distributors and wholesale buyers in India and abroad. Send your requirement to ACI Agro Solution.",
    url: "https://aciagro.com/bulk-order",
    siteName: "ACI Agro Solution",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ACI Agro Solution - Ayurvedic and Herbal Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Herbal Juice Bulk Supplier in India | ACI Agro Solution",
    description: "Bulk supply of herbal and Ayurvedic juices for retailers, distributors and wholesale buyers in India and abroad. Send your requirement to ACI Agro Solution.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BulkOrderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd([
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Bulk Supply", path: "/bulk-order" },
            ]),
            serviceJsonLd({
              name: "Bulk Herbal Juice Supply",
              serviceType: "Wholesale and bulk supply of herbal and Ayurvedic juices",
              description: "Bulk supply of herbal and Ayurvedic juices for retailers, distributors, wellness centres and wholesale buyers in India and abroad.",
              path: "/bulk-order",
            }),
          ]),
        }}
      />
      <BulkIntro />
      <B2BFacts />
      <OrderForm />
      <Certificates />
    </>
  );
}
