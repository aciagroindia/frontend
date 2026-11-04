// JSON-LD helpers (structured data).
const SITE_URL = "https://aciagro.com";

// <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(obj) }} /> ke liye safe string
export function toJsonLd(obj) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

// items: [{ name: "Home", path: "/" }, { name: "Bulk Supply", path: "/bulk-order" }]
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

// B2B service page ke liye. provider layout.tsx wale Organization (@id) se judta hai.
export function serviceJsonLd({ name, serviceType, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: ["IN", "Worldwide"],
  };
}
