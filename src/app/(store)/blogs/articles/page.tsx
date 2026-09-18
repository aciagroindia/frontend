import type { Metadata } from "next";
import ArticlesClient from "./ArticlesClient";

export const metadata: Metadata = {
  title: "Articles & Blogs | ACI Agro Solutions",
  description: "Explore Ayurvedic wellness tips, ancient natural remedies, lifestyle advice, and herbal solutions from the health experts at ACI Agro Solutions.",
  alternates: {
    canonical: "https://aciagro.com/blogs/articles",
  },
  openGraph: {
    title: "Articles & Blogs | ACI Agro Solutions",
    description: "Explore Ayurvedic wellness tips, ancient natural remedies, lifestyle advice, and herbal solutions from the health experts at ACI Agro Solutions.",
    url: "https://aciagro.com/blogs/articles",
    siteName: "ACI Agro Solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles & Blogs | ACI Agro Solutions",
    description: "Explore Ayurvedic wellness tips, ancient natural remedies, lifestyle advice, and herbal solutions from the health experts at ACI Agro Solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ArticlesPage() {
  return <ArticlesClient />;
}