import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import axiosInstance from "@/utils/axiosInstance";

export const dynamic = "force-dynamic";

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