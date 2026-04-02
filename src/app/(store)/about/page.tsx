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

export default function AboutPage() {
  const [media, setMedia] = useState<AboutMedia[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axiosInstance.get("/about-media");
        if (res.data.success) {
          setMedia(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch about media:", error);
      }
    };
    fetchMedia();
  }, []);

  return (
    <div className={styles.container}>
      
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Rooted in Ayurveda. Crafted for Modern Life.</h1>
          <p>
            We blend ancient Ayurvedic wisdom with modern science to create
            pure, effective, and sustainable wellness products.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className={styles.section}>
        <div className={styles.textBlock}>
          <h2>Our Story</h2>
          <p>
            Our journey began with a simple belief — true wellness comes from
            nature. Inspired by centuries-old Ayurvedic formulations, we set
            out to create products that are safe, transparent, and deeply
            rooted in tradition.
          </p>
          <p>
            Every product is thoughtfully crafted using ethically sourced herbs,
            carefully tested, and formulated to restore balance to your body
            and mind.
          </p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className={styles.altSection}>
        <div className={styles.split}>
          <div className={styles.imageWrapper}>
            <Image src="/certifiedIcons/whychooseus.png" alt="Ayurveda" fill className={styles.image}/>
          </div>
          <div className={styles.textSide}>
            <h2>The Ayurvedic Philosophy</h2>
            <p>
              Ayurveda teaches balance — balance of body, mind, and spirit.
              Our formulations are designed to support natural healing using
              time-tested herbs without harmful chemicals.
            </p>
          </div>
        </div>
      </section>

      {/* DYNAMIC MEDIA GALLERY */}
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
                    />
                  )}
                </div>
                {item.title && <p className={styles.mediaCaption}>{item.title}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* INGREDIENTS */}
      <section className={styles.section}>
        <h2>Pure Ingredients. Ethical Sourcing.</h2>
        <p>
          We work directly with trusted farmers to source organic herbs.
          No parabens. No sulfates. No synthetic toxins.
        </p>
      </section>

      {/* QUALITY */}
      <section className={styles.altSection}>
        <h2>Quality & Safety First</h2>
        <p>
          Manufactured in GMP-certified facilities and tested for purity,
          potency, and safety before reaching your home.
        </p>
      </section>

      {/* CERTIFICATES */}
      <Certificates />

      {/* TRUST METRICS */}
      <section className={styles.metrics}>
        <div>
          <h3>10,000+</h3>
          <p>Happy Customers</p>
        </div>
        <div>
          <h3>4.8★</h3>
          <p>Average Rating</p>
        </div>
        <div>
          <h3>100%</h3>
          <p>Natural Ingredients</p>
        </div>
      </section>

      {/* CLOSING */}
      <section className={styles.closing}>
        <h2>Experience the Power of Nature 🌿</h2>
        <p>
          Join thousands who trust us for authentic Ayurvedic wellness.
        </p>
      </section>

    </div>
  );
}