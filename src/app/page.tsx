import type { Metadata } from "next";
import Hero from "../../components/Hero/Hero";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Testimonials from "../../components/Testimonials/Testimonials";
import ShopByConcern from "../../components/ShopByConcern/ShopByConcern";
import ScrollingStrip from "../../components/ScrollingStrip/ScrollingStrip";

export const metadata: Metadata = {
  title: "Aci Agro Solutions | Authentic Ayurvedic Wellness Products",
  description: "Shop authentic Ayurvedic and herbal wellness products made with traditional wisdom by ACI Agro Solutions.",
  alternates: {
    canonical: "https://aciagro.com/",
  },
  openGraph: {
    title: "Aci Agro Solutions | Authentic Ayurvedic Wellness Products",
    description: "Shop authentic Ayurvedic and herbal wellness products made with traditional wisdom by ACI Agro Solutions.",
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
    title: "Aci Agro Solutions | Authentic Ayurvedic Wellness Products",
    description: Shop authentic Ayurvedic and herbal wellness products made with traditional wisdom by ACI Agro Solutions.",
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
      <ShopByConcern />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
    </div>
    </>
  );
}
