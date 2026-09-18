import type { Metadata } from "next";
import Hero from "../../components/Hero/Hero";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Testimonials from "../../components/Testimonials/Testimonials";
import ShopByConcern from "../../components/ShopByConcern/ShopByConcern";
import ScrollingStrip from "../../components/ScrollingStrip/ScrollingStrip";

export const metadata: Metadata = {
  title: "Aci Agro Solutions | Authentic Ayurvedic Wellness Products",
  description: "Discover pure and authentic Ayurvedic wellness products crafted with traditional wisdom and modern precision at ACI Agro Solutions.",
  alternates: {
    canonical: "https://aciagro.com/",
  },
  openGraph: {
    title: "Aci Agro Solutions | Authentic Ayurvedic Wellness Products",
    description: "Discover pure and authentic Ayurvedic wellness products crafted with traditional wisdom and modern precision at ACI Agro Solutions.",
    url: "https://aciagro.com/",
    siteName: "ACI Agro Solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aci Agro Solutions | Authentic Ayurvedic Wellness Products",
    description: "Discover pure and authentic Ayurvedic wellness products crafted with traditional wisdom and modern precision at ACI Agro Solutions.",
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