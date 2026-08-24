"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./about.module.css";
import Certificates from "../../../../components/Certificates/Certificate";

interface AboutMedia {
  _id: string;
  type: "image" | "video";
  url: string;
  title?: string;
}

interface CustomSection {
  id: string;
  title: string;
  tag?: string;
  content: string;
  imageUrl?: string;
  layout: "center" | "split-left" | "split-right" | "banner";
  bgType: "color" | "image";
  bgColor?: string;
  bgImage?: string;
  headingColor?: string;
  textColor?: string;
  order?: number;
  isActive: boolean;
}

interface AboutPageConfig {
  hero: {
    title: string;
    subtitle: string;
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    textColor?: string;
    isActive: boolean;
  };
  story: {
    title: string;
    paragraphs: string[];
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    headingColor?: string;
    textColor?: string;
    isActive: boolean;
  };
  philosophy: {
    title: string;
    description: string;
    imageUrl?: string;
    imagePosition?: "left" | "right";
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    headingColor?: string;
    textColor?: string;
    isActive: boolean;
  };
  ingredients: {
    title: string;
    description: string;
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    headingColor?: string;
    textColor?: string;
    isActive: boolean;
  };
  quality: {
    title: string;
    description: string;
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    headingColor?: string;
    textColor?: string;
    isActive: boolean;
  };
  metrics: {
    items: { value: string; label: string }[];
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    textColor?: string;
    isActive: boolean;
  };
  closing: {
    title: string;
    subtitle: string;
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    headingColor?: string;
    textColor?: string;
    isActive: boolean;
  };
  customSections: CustomSection[];
}

const DEFAULT_CONFIG: AboutPageConfig = {
  hero: {
    title: "Rooted in Ayurveda. Crafted for Modern Life.",
    subtitle:
      "We blend ancient Ayurvedic wisdom with modern science to create pure, effective, and sustainable wellness products.",
    bgType: "image",
    bgColor: "#14854e",
    bgImage: "/banner1.jpg",
    textColor: "#ffffff",
    isActive: true,
  },
  story: {
    title: "Our Story",
    paragraphs: [
      "Our journey began with a simple belief — true wellness comes from nature. Inspired by centuries-old Ayurvedic formulations, we set out to create products that are safe, transparent, and deeply rooted in tradition.",
      "Every product is thoughtfully crafted using ethically sourced herbs, carefully tested, and formulated to restore balance to your body and mind.",
    ],
    bgType: "color",
    bgColor: "#f3f9f6",
    bgImage: "",
    headingColor: "#14854e",
    textColor: "#374151",
    isActive: true,
  },
  philosophy: {
    title: "The Ayurvedic Philosophy",
    description:
      "Ayurveda teaches balance — balance of body, mind, and spirit. Our formulations are designed to support natural healing using time-tested herbs without harmful chemicals.",
    imageUrl: "/certifiedIcons/whychooseus.png",
    imagePosition: "left",
    bgType: "color",
    bgColor: "#fffdf8",
    bgImage: "",
    headingColor: "#111827",
    textColor: "#4b5563",
    isActive: true,
  },
  ingredients: {
    title: "Pure Ingredients. Ethical Sourcing.",
    description:
      "We work directly with trusted farmers to source organic herbs. No parabens. No sulfates. No synthetic toxins.",
    bgType: "color",
    bgColor: "#f3f9f6",
    bgImage: "",
    headingColor: "#111827",
    textColor: "#4b5563",
    isActive: true,
  },
  quality: {
    title: "Quality & Safety First",
    description:
      "Manufactured in GMP-certified facilities and tested for purity, potency, and safety before reaching your home.",
    bgType: "color",
    bgColor: "#fffdf8",
    bgImage: "",
    headingColor: "#111827",
    textColor: "#4b5563",
    isActive: true,
  },
  metrics: {
    items: [
      { value: "10,000+", label: "Happy Customers" },
      { value: "4.8★", label: "Average Rating" },
      { value: "100%", label: "Natural Ingredients" },
    ],
    bgType: "color",
    bgColor: "#14854e",
    bgImage: "",
    textColor: "#ffffff",
    isActive: true,
  },
  closing: {
    title: "Experience the Power of Nature 🌿",
    subtitle: "Join thousands who trust us for authentic Ayurvedic wellness.",
    bgType: "color",
    bgColor: "#f3f9f6",
    bgImage: "",
    headingColor: "#111827",
    textColor: "#4b5563",
    isActive: true,
  },
  customSections: [],
};

export default function AboutPage() {
  const [media, setMedia] = useState<AboutMedia[]>([]);
  const [config, setConfig] = useState<AboutPageConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // 1. Fetch About Media Gallery
      try {
        const mediaRes = await axiosInstance.get("/about-media");
        if (mediaRes.data?.success && isMounted) {
          setMedia(mediaRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch about media:", error);
      }

      // 2. Fetch About Page Config
      try {
        const pageRes = await axiosInstance.get("/about-page");
        if (pageRes.data?.success && pageRes.data?.data && isMounted) {
          setConfig((prev) => ({
            ...prev,
            ...pageRes.data.data,
            hero: { ...prev.hero, ...pageRes.data.data.hero },
            story: { ...prev.story, ...pageRes.data.data.story },
            philosophy: { ...prev.philosophy, ...pageRes.data.data.philosophy },
            ingredients: { ...prev.ingredients, ...pageRes.data.data.ingredients },
            quality: { ...prev.quality, ...pageRes.data.data.quality },
            metrics: { ...prev.metrics, ...pageRes.data.data.metrics },
            closing: { ...prev.closing, ...pageRes.data.data.closing },
            customSections: pageRes.data.data.customSections || [],
          }));
        }
      } catch (error) {
        console.error("Failed to fetch about page config:", error);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const getSectionBgStyle = (sec?: {
    bgType?: "color" | "image";
    bgColor?: string;
    bgImage?: string;
  }) => {
    if (!sec) return {};
    if (sec.bgType === "image" && sec.bgImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${sec.bgImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {
      backgroundColor: sec.bgColor || "transparent",
    };
  };

  const { hero, story, philosophy, ingredients, quality, metrics, closing, customSections } = config;

  return (
    <div className={styles.container}>
      {/* 1. HERO */}
      {hero.isActive !== false && (
        <section
          className={styles.hero}
          style={
            hero.bgType === "image" && hero.bgImage
              ? {
                  backgroundImage: `linear-gradient(rgba(20,133,78,0.85), rgba(20,133,78,0.85)), url("${hero.bgImage}")`,
                  color: hero.textColor || "#ffffff",
                }
              : {
                  backgroundColor: hero.bgColor || "#14854e",
                  color: hero.textColor || "#ffffff",
                }
          }
        >
          <div className={styles.heroContent}>
            <h1>{hero.title}</h1>
            <p>{hero.subtitle}</p>
          </div>
        </section>
      )}

      {/* 2. OUR STORY */}
      {story.isActive !== false && (
        <section
          className={styles.section}
          style={{
            ...getSectionBgStyle(story),
            color: story.textColor || "#374151",
          }}
        >
          <div className={styles.textBlock}>
            <h2 style={{ color: story.headingColor || "#14854e" }}>
              {story.title}
            </h2>
            {story.paragraphs && story.paragraphs.length > 0 ? (
              story.paragraphs.map((para, i) => (
                <p key={i} className={styles.storyParagraph}>
                  {para}
                </p>
              ))
            ) : (
              <p className={styles.storyParagraph}>
                Our journey began with a simple belief — true wellness comes from nature.
              </p>
            )}
          </div>
        </section>
      )}

      {/* 3. PHILOSOPHY */}
      {philosophy.isActive !== false && (
        <section
          className={styles.altSection}
          style={{
            ...getSectionBgStyle(philosophy),
            color: philosophy.textColor || "#4b5563",
          }}
        >
          <div
            className={`${styles.split} ${
              philosophy.imagePosition === "right" ? styles.splitReverse : ""
            }`}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={philosophy.imageUrl || "/certifiedIcons/whychooseus.png"}
                alt={philosophy.title || "Ayurveda"}
                fill
                className={styles.image}
                unoptimized={
                  typeof philosophy.imageUrl === "string" &&
                  philosophy.imageUrl.startsWith("http")
                }
              />
            </div>
            <div className={styles.textSide}>
              <h2 style={{ color: philosophy.headingColor || "#111827" }}>
                {philosophy.title}
              </h2>
              <p>{philosophy.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* 4. DYNAMIC MEDIA GALLERY (Existing) */}
      {media.length > 0 && (
        <section className={styles.gallery}>
          <h2>Our Visual Journey</h2>
          <p>A glimpse into our world of wellness and nature.</p>
          <div className={styles.galleryGrid}>
            {media.map((item) => (
              <div key={item._id} className={styles.mediaCard}>
                <div className={styles.mediaWrapper}>
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      className={styles.mediaElement}
                      controls
                      muted
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.title || "About Media"}
                      fill
                      className={styles.mediaElement}
                      unoptimized={
                        typeof item.url === "string" && item.url.startsWith("http")
                      }
                    />
                  )}
                </div>
                {item.title && <p className={styles.mediaCaption}>{item.title}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. INGREDIENTS */}
      {ingredients.isActive !== false && (
        <section
          className={styles.section}
          style={{
            ...getSectionBgStyle(ingredients),
            color: ingredients.textColor || "#4b5563",
          }}
        >
          <h2 style={{ color: ingredients.headingColor || "#111827" }}>
            {ingredients.title}
          </h2>
          <p>{ingredients.description}</p>
        </section>
      )}

      {/* 6. QUALITY & SAFETY */}
      {quality.isActive !== false && (
        <section
          className={styles.altSection}
          style={{
            ...getSectionBgStyle(quality),
            color: quality.textColor || "#4b5563",
          }}
        >
          <h2 style={{ color: quality.headingColor || "#111827" }}>
            {quality.title}
          </h2>
          <p>{quality.description}</p>
        </section>
      )}

      {/* 7. DYNAMIC CUSTOM SECTIONS ADDED BY ADMIN */}
      {customSections &&
        customSections.length > 0 &&
        customSections
          .filter((sec) => sec.isActive !== false)
          .map((sec) => (
            <section
              key={sec.id}
              className={styles.customSection}
              style={{
                ...getSectionBgStyle(sec),
                color: sec.textColor || "#4b5563",
              }}
            >
              <div className={styles.customContainer}>
                {sec.layout === "banner" ? (
                  <div className={styles.customBannerContent}>
                    {sec.tag && <span className={styles.customTag}>{sec.tag}</span>}
                    <h2
                      className={styles.customTitle}
                      style={{ color: sec.headingColor || "#111827" }}
                    >
                      {sec.title}
                    </h2>
                    <p className={styles.customBody}>{sec.content}</p>
                  </div>
                ) : sec.layout === "split-left" || sec.layout === "split-right" ? (
                  <div
                    className={`${styles.split} ${
                      sec.layout === "split-right" ? styles.splitReverse : ""
                    }`}
                  >
                    {sec.imageUrl && (
                      <div className={styles.imageWrapper}>
                        <Image
                          src={sec.imageUrl}
                          alt={sec.title || "Custom Section"}
                          fill
                          className={styles.image}
                          unoptimized={
                            typeof sec.imageUrl === "string" &&
                            sec.imageUrl.startsWith("http")
                          }
                        />
                      </div>
                    )}
                    <div className={styles.textSide}>
                      {sec.tag && <span className={styles.customTag}>{sec.tag}</span>}
                      <h2
                        className={styles.customTitle}
                        style={{ color: sec.headingColor || "#111827" }}
                      >
                        {sec.title}
                      </h2>
                      <p className={styles.customBody}>{sec.content}</p>
                    </div>
                  </div>
                ) : (
                  // Default Centered
                  <div className={styles.customCenterContent}>
                    {sec.tag && <span className={styles.customTag}>{sec.tag}</span>}
                    <h2
                      className={styles.customTitle}
                      style={{ color: sec.headingColor || "#111827" }}
                    >
                      {sec.title}
                    </h2>
                    <p className={styles.customBody}>{sec.content}</p>
                  </div>
                )}
              </div>
            </section>
          ))}

      {/* 8. CERTIFICATES (Existing) */}
      <Certificates />

      {/* 9. TRUST METRICS */}
      {metrics.isActive !== false && (
        <section
          className={styles.metrics}
          style={{
            ...getSectionBgStyle(metrics),
            color: metrics.textColor || "#ffffff",
          }}
        >
          {metrics.items &&
            metrics.items.map((item, idx) => (
              <div key={idx}>
                <h3>{item.value}</h3>
                <p>{item.label}</p>
              </div>
            ))}
        </section>
      )}

      {/* 10. CLOSING CTA */}
      {closing.isActive !== false && (
        <section
          className={styles.closing}
          style={{
            ...getSectionBgStyle(closing),
            color: closing.textColor || "#4b5563",
          }}
        >
          <h2 style={{ color: closing.headingColor || "#111827" }}>
            {closing.title}
          </h2>
          <p>{closing.subtitle}</p>
        </section>
      )}
    </div>
  );
}