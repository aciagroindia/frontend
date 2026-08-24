"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./WhyChooseUs.module.css";

const DEFAULT_DATA = {
  tag: "ROOTED IN TRADITION",
  mainHeading: "WHY CHOOSE US",
  heading: "Crafted by Nature.",
  subheading: "Powered by ACI.",
  description:
    "ACI me hum ancient Ayurvedic wisdom ko modern science ke saath combine karke aise products banate hain jo aapke body ko naturally nourish kare. Har ingredient carefully source kiya jata hai, ethically process hota hai, aur proper testing ke baad hi use hota hai — taaki aapko mile pure, natural aur trusted wellness.",
  points: [
    {
      title: "✔ 100% Natural",
      description: "No artificial additives or preservatives.",
    },
    {
      title: "✔ Ethically Sourced",
      description: "Direct partnerships with trusted farmers.",
    },
    {
      title: "✔ Lab Tested",
      description: "Strict quality control for every batch.",
    },
  ],
  imageUrl: "/certifiedIcons/whychooseus.png",
  isActive: true,
};

export default function WhyChooseUs() {
  const [data, setData] = useState(DEFAULT_DATA);

  useEffect(() => {
    let isMounted = true;
    const fetchWhyChooseUs = async () => {
      try {
        const res = await axiosInstance.get("/why-choose-us");
        if (res.data?.success && res.data?.data && isMounted) {
          setData(res.data.data);
        }
      } catch (err) {
        // Fallback to default values if request fails
        console.error("Error fetching why-choose-us:", err);
      }
    };

    fetchWhyChooseUs();
    return () => {
      isMounted = false;
    };
  }, []);

  if (data.isActive === false) {
    return null;
  }

  const imageSrc = data.imageUrl || "/certifiedIcons/whychooseus.png";

  return (
    <section className={styles.section} id="why-choose-us">
      <h2 className={styles.mainHeading}>{data.mainHeading || "WHY CHOOSE US"}</h2>

      <div className={styles.container}>
        {/* LEFT CONTENT */}
        <div className={styles.content}>
          <span className={styles.tag}>{data.tag || "ROOTED IN TRADITION"}</span>

          <h2 className={styles.heading}>
            {data.heading || "Crafted by Nature."}{" "}
            {data.subheading && (
              <>
                <br />
                <span>{data.subheading}</span>
              </>
            )}
          </h2>

          <p className={styles.description}>{data.description}</p>

          <div className={styles.points}>
            {data.points && data.points.length > 0 ? (
              data.points.map((point, index) => (
                <div key={index} className={styles.pointItem}>
                  <strong className={styles.pointTitle}>{point.title}</strong>
                  <p className={styles.pointDesc}>{point.description}</p>
                </div>
              ))
            ) : (
              DEFAULT_DATA.points.map((point, index) => (
                <div key={index} className={styles.pointItem}>
                  <strong className={styles.pointTitle}>{point.title}</strong>
                  <p className={styles.pointDesc}>{point.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageBg}></div>
          <Image
            src={imageSrc}
            alt={data.heading || "ACI Product - Crafted by Nature"}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 500px"
            unoptimized={typeof imageSrc === "string" && imageSrc.startsWith("http")}
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
