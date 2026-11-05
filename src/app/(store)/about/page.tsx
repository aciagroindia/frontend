import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import axiosInstance from "@/utils/axiosInstance";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "About ACI Agro Solution | Herbal Juice Manufacturer Jaipur" },
  description: "Learn about ACI Agro Solution, our Ayurvedic philosophy, pure ethically sourced ingredients, and commitment to authentic traditional wellness.",
  alternates: {
    canonical: "https://aciagro.com/about",
  },
  openGraph: {
    title: "About Us | ACI Agro Solution",
    description: "Learn about ACI Agro Solution, our Ayurvedic philosophy, pure ethically sourced ingredients, and commitment to authentic traditional wellness.",
    url: "https://aciagro.com/about",
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
    title: "About Us | ACI Agro Solution",
    description: "Learn about ACI Agro Solution, our Ayurvedic philosophy, pure ethically sourced ingredients, and commitment to authentic traditional wellness.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function getAboutData() {
  try {
    const [pageRes, mediaRes] = await Promise.allSettled([
      axiosInstance.get("/about-page"),
      axiosInstance.get("/about-media"),
    ]);

    const initialConfig =
      pageRes.status === "fulfilled" && pageRes.value.data?.success && pageRes.value.data?.data
        ? pageRes.value.data.data
        : null;

    const initialMedia =
      mediaRes.status === "fulfilled" && mediaRes.value.data?.success && mediaRes.value.data?.data
        ? mediaRes.value.data.data
        : [];

    return { initialConfig, initialMedia };
  } catch (err) {
    return { initialConfig: null, initialMedia: [] };
  }
}

export default async function AboutPage() {
  const { initialConfig, initialMedia } = await getAboutData();
  return <AboutClient initialConfig={initialConfig} initialMedia={initialMedia} />;
}
