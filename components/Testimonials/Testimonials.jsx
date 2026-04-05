"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Testimonials.module.css";
import axiosInstance from "../../src/utils/axiosInstance"; 

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const trackRef = useRef(null);

  // ✅ FETCH FROM BACKEND USING AXIOS INSTANCE
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Base URL axiosInstance mein already set hai, toh bas endpoint dena hai
        const res = await axiosInstance.get("/reviews/testimonials");
        
        // Axios automatically data parse karta hai, toh await res.json() nahi likhna padega
        const data = res.data;

        // 🔥 MAP BACKEND DATA → FRONTEND FORMAT
        if (data && data.testimonials) {
          const formatted = data.testimonials.map((item) => ({
            id: item.reviewId,
            name: item.name,
            text: item.comment,
            img: item.productImage || "/certifiedIcons/image1.png",
            rating: item.rating,
          }));

          setTestimonials(formatted);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  // ✅ ANIMATION (RUN AFTER DATA LOAD)
  useEffect(() => {
    const track = trackRef.current;
    if (!track || testimonials.length === 0) return;

    let animationFrame;
    let position = 0;
    const speed = 0.6;

    const singleWidth = track.scrollWidth / 2;

    const animate = () => {
      position -= speed;

      if (Math.abs(position) >= singleWidth) {
        position = 0;
      }

      track.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [testimonials]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>REAL CUSTOMERS REAL RESULTS</h2>
        <p className={styles.sub}>What customers are saying about ACI?</p>

        <div className={styles.sliderWrapper}>
          <div className={styles.track} ref={trackRef}>
            {[...testimonials, ...testimonials].map((item, index) => (
              <div key={`${item.id}-${index}`} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "#2e7d32",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.name ? item.name.charAt(0) : ""}
                  </div>
                </div>

                <h4 className={styles.name}>{item.name}</h4>

                <div className={styles.rating}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < item.rating ? "#2e7d32" : "#e0e0e0",
                        fontSize: "1.2rem",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className={styles.text}>"{item.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}