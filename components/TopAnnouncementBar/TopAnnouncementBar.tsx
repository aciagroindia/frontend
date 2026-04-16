"use client";

import { useState, useEffect } from 'react';
import styles from './TopAnnouncementBar.module.css';

const announcements = [
  "🌿 100% Pure & Organic Ayurvedic Solutions",
  "🚚 Free Shipping on all orders above ₹999!",
  "⚡ Flash Sale: Get 20% Off on Bestsellers",
  "🛡️ Safe, Secure & 100% Trusted Payments"
];

export default function TopAnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Har 3 second me loop chalega
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.announcementContainer}>
      <div className={styles.textWrapper}>
        {announcements.map((text, index) => (
          <p
            key={index}
            className={`${styles.announcementText} ${
              index === currentIndex ? styles.active : styles.hidden
            }`}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}