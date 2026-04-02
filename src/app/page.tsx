import Hero from "../../components/Hero/Hero";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Testimonials from "../../components/Testimonials/Testimonials";
import ShopByConcern from "../../components/ShopByConcern/ShopByConcern";
import ScrollingStrip from "../../components/ScrollingStrip/ScrollingStrip";

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