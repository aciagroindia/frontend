import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | ACI Agro Solutions",
  description: "Learn about ACI Agro Solutions, our Ayurvedic philosophy, pure ethically sourced ingredients, and commitment to authentic traditional wellness.",
  alternates: {
    canonical: "https://aciagro.com/about",
  },
  openGraph: {
    title: "About Us | ACI Agro Solutions",
    description: "Learn about ACI Agro Solutions, our Ayurvedic philosophy, pure ethically sourced ingredients, and commitment to authentic traditional wellness.",
    url: "https://aciagro.com/about",
    siteName: "ACI Agro Solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | ACI Agro Solutions",
    description: "Learn about ACI Agro Solutions, our Ayurvedic philosophy, pure ethically sourced ingredients, and commitment to authentic traditional wellness.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return <AboutClient />;
}