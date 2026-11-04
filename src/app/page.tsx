import type { Metadata } from "next";
import Hero from "../../components/Hero/Hero";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Testimonials from "../../components/Testimonials/Testimonials";
import ShopByConcern from "../../components/ShopByConcern/ShopByConcern";
import ScrollingStrip from "../../components/ScrollingStrip/ScrollingStrip";
import HomeIntro from "../../components/HomeIntro/HomeIntro";

export const metadata: Metadata = {
  // absolute: layout ka template ("| ACI Agro Solutions") yahan dobara na lage
  title: { absolute: "Buy Herbal Juice Online in India | ACI Agro Solutions" },
  description: "Buy authentic Ayurvedic and herbal juices online in India, from aloe vera to shatavari. Bulk, private label and export enquiries welcome at ACI Agro Solutions.",
  alternates: {
    canonical: "https://aciagro.com/",
  },
  openGraph: {
    title: "Buy Herbal Juice Online in India | ACI Agro Solutions",
    description: "Buy authentic Ayurvedic and herbal juices online in India, from aloe vera to shatavari. Bulk, private label and export enquiries welcome at ACI Agro Solutions.",
    url: "https://aciagro.com/",
    siteName: "ACI Agro Solutions",
    images: [
  {
    url: "https://aciagro.com/og-image.png",
    width: 1200,
    height: 630,
    alt: "ACI Agro Solutions - Ayurvedic and Herbal Wellness",
  },
],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://aciagro.com/og-image.png"],
    title: "Buy Herbal Juice Online in India | ACI Agro Solutions",
    description: "Buy authentic Ayurvedic and herbal juices online in India, from aloe vera to shatavari. Bulk, private label and export enquiries welcome at ACI Agro Solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <>
    <div className="min-h-screen mt-[86px]">
      <Hero />
      <ScrollingStrip />
      <HomeIntro />
      <ShopByConcern />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
    </div>
    </>
  );
}
