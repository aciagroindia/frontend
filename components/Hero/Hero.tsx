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
  link?: string;
  order: number;
}

const Hero = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 👇 1. INSTANT LOAD LOGIC: LocalStorage se purane banners turant nikal lo
    const cachedBanners = localStorage.getItem('hero_banners');
    if (cachedBanners) {
      setBanners(JSON.parse(cachedBanners));
      setLoading(false); // Cache milte hi loading khatam, UI turant dikhega!
    }

    // 👇 2. BACKGROUND SYNC: Chup-chaap naye banners check karo
    const fetchActiveBanners = async () => {
      try {
        // Agar cache nahi mila, tabhi loading true karo
        if (!cachedBanners) setLoading(true); 

        const response = await axiosInstance.get<any[]>('/banners');
        const processedBanners = response.data
          .map(banner => ({ ...banner, id: banner._id }))
          .sort((a, b) => a.order - b.order);

        // Naye banners set karo aur memory me save kar lo future ke liye
        setBanners(processedBanners);
        localStorage.setItem('hero_banners', JSON.stringify(processedBanners));
        
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
    return <div className={styles.heroPlaceholder} />;
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className={styles.heroWrapper}>
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
        >
          <Link href={banner.link || '#'} className={styles.bannerLink}>
            <Image
              src={banner.imageUrl}
              alt={banner.title || 'Hero Banner'}
              width={1920}
              height={650}
              priority={index === 0}
              className={styles.bannerImg}
              sizes="100vw"
            />
          </Link>
        </div>
      ))}

      {banners.length > 1 && (
        <div className={styles.indicators}>
          {banners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;