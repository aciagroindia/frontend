import type { Metadata } from "next";
import Hero, { Banner } from "../../components/Hero/Hero";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Testimonials from "../../components/Testimonials/Testimonials";
import ShopByConcern from "../../components/ShopByConcern/ShopByConcern";
import ScrollingStrip from "../../components/ScrollingStrip/ScrollingStrip";
import axiosInstance from "@/utils/axiosInstance";

export const revalidate = 60;

async function getBanners(): Promise<Banner[]> {
  try {
    const res = await axiosInstance.get("/banners");
    return (res.data || [])
      .map((banner: any) => ({ ...banner, id: banner._id || banner.id }))
      .sort((a: any, b: any) => (Number(a.order) || 0) - (Number(b.order) || 0));
  } catch (error) {
    return [];
  }
}

async function getBestSellers(): Promise<any[]> {
  try {
    const res = await axiosInstance.get("/products/best-sellers");
    const list = res.data?.products || res.data?.data;
    if (res.data?.success && Array.isArray(list)) {
      return list.map((p: any) => ({ ...p, id: p._id || p.id }));
    }
    return [];
  } catch (error) {
    return [];
  }
}

async function getCategories(): Promise<any[]> {
  try {
    const res = await axiosInstance.get("/categories");
    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data.map((c: any) => ({ ...c, id: c._id || c.id }));
    }
    return [];
  } catch (error) {
    return [];
  }
}

async function getWhyChooseUs(): Promise<any> {
  try {
    const res = await axiosInstance.get("/why-choose-us");
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function getTestimonials(): Promise<any[]> {
  try {
    const res = await axiosInstance.get("/reviews/testimonials");
    if (res.data?.testimonials && Array.isArray(res.data.testimonials)) {
      return res.data.testimonials.map((item: any) => ({
        id: item.reviewId || item._id,
        name: item.name,
        text: item.comment,
        img: item.productImage || "/certifiedIcons/image1.png",
        rating: item.rating,
      }));
    }
    return [];
  } catch (error) {
    return [];
  }
}

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

export default async function Home() {
  const [banners, bestSellers, categories, whyChooseUs, testimonials] = await Promise.all([
    getBanners(),
    getBestSellers(),
    getCategories(),
    getWhyChooseUs(),
    getTestimonials(),
  ]);

  return (
    <>
      <div className="min-h-screen mt-[86px]">
        <Hero initialBanners={banners} />
        <ScrollingStrip />
        <ShopByConcern initialCategories={categories} />
        <FeaturedProducts initialBestSellers={bestSellers} />
        <WhyChooseUs initialData={whyChooseUs} />
        <Testimonials initialTestimonials={testimonials} />
      </div>
    </>
  );
}