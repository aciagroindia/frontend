"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import FeaturesStrip from "./FeaturesStrip/FeaturesStrip";
import TopAnnouncementBar from "./TopAnnouncementBar/TopAnnouncementBar";
import WhatsAppButton from "./WhatsAppButton/WhatsAppButton";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <TopAnnouncementBar />
      <Navbar />
      {children}
      <WhatsAppButton />
      <FeaturesStrip />
      <Footer />
    </>
  );
}