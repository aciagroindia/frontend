"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';
import axiosInstance from '@/utils/axiosInstance';

// Backend se aane wala Banner ka structure
interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string; // Optional link for the banner
  order: number;
}

const Hero = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBanners = async () => {
      try {
        setLoading(true);
        // Public endpoint, backend should only send active banners
        const response = await axiosInstance.get<any[]>('/banners');
        // Map backend's `_id` to `id` for React key prop and then sort.
        const processedBanners = response.data
          .map(banner => ({ ...banner, id: banner._id }))
          .sort((a, b) => a.order - b.order);
        setBanners(processedBanners);
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000); // Har 5 second me slide badle

      return () => clearTimeout(timer);
    }
  }, [currentIndex, banners.length]);

  if (loading) {
    // Layout shift se bachne ke liye placeholder
    return <div className={styles.heroWrapper} style={{ aspectRatio: '16 / 7', backgroundColor: '#f0f0f0' }} />;
  }

  if (!banners || banners.length === 0) {
    return null; // Agar koi banner nahi hai to kuch na dikhaye
  }

  return (
    <div className={styles.heroWrapper}>
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
        >
          <Link href={banner.link || '#'}>
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              priority={index === 0} // Pehle banner ko jaldi load karein
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Hero;