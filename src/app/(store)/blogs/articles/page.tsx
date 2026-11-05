import type { Metadata } from "next";
import ArticlesClient from "./ArticlesClient";

export const metadata: Metadata = {
  title: "Articles & Blogs",
  description: "Explore Ayurvedic wellness tips, ancient natural remedies, lifestyle advice, and herbal solutions from the health experts at ACI Agro Solution.",
  alternates: {
    canonical: "https://aciagro.com/blogs/articles",
  },
  openGraph: {
    title: "Articles & Blogs | ACI Agro Solution",
    description: "Explore Ayurvedic wellness tips, ancient natural remedies, lifestyle advice, and herbal solutions from the health experts at ACI Agro Solution.",
    url: "https://aciagro.com/blogs/articles",
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
    title: "Articles & Blogs | ACI Agro Solution",
    description: "Explore Ayurvedic wellness tips, ancient natural remedies, lifestyle advice, and herbal solutions from the health experts at ACI Agro Solution.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ArticlesPage() {
  return <ArticlesClient />;
}
