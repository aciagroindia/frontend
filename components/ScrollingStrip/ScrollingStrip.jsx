"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./ScrollingStrip.module.css";

export default function CertifiedStrip() {
  const trackRef = useRef(null);

  const items = [
    { text: "No Artificial Colors or Flavors", icon: "/certifiedIcons/Asset_12.svg" },
    { text: "Certified Organic Products", icon: "/certifiedIcons/Asset_15.svg" },
    { text: "Sourced Directly from Farmers", icon: "/certifiedIcons/Asset_16.svg" },
    { text: "Maximize Farmers Profit", icon: "/certifiedIcons/Asset_13.svg" },
    { text: "100% Natural Herbs", icon: "/certifiedIcons/Asset_14.svg" },
    { text: "No Added Sugar", icon: "/certifiedIcons/Asset_17.svg" },
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
 
    let animationFrame = null;
    let position = 0;
    // Speed is set to 1 for a smoother animation.
    // Increase this value (e.g., to 2 or 3) to make it faster.
    const speed = 2;
 
    const animate = () => {
      position -= speed;
 
      // Reset position when half of the strip is scrolled for a seamless loop
      if (track.scrollWidth > 0 && Math.abs(position) >= track.scrollWidth / 2) {
        position = 0;
      }
 
      track.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };
 
    const startAnimation = () => {
      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
 
    const stopAnimation = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };
 
    track.addEventListener("mouseenter", stopAnimation);
    track.addEventListener("mouseleave", startAnimation);
 
    startAnimation();
 
    return () => {
      stopAnimation();
      if (track) {
        track.removeEventListener("mouseenter", stopAnimation);
        track.removeEventListener("mouseleave", startAnimation);
      }
    };
  }, []);

  return (
    <section className={styles.wrapper}>
      <div
        className={styles.marquee}
        ref={trackRef}
      >
        {[...items, ...items].map((item, index) => (
          <div key={index} className={styles.item}>
            <Image
              src={item.icon}
              alt={item.text}
              width={40}
              height={40}
              className={styles.icon}
            />
            <span className={styles.text}>{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
