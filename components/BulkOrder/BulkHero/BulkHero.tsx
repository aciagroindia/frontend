"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../Hero/Hero.module.css';
import axiosInstance from '@/utils/axiosInstance';

interface BulkBannerItem {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  order: number;
}

export default function BulkHero() {
  const [banners, setBanners] = useState<BulkBannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Instant Cache Load from localStorage
    const cachedBanners = localStorage.getItem('bulk_banners');
    if (cachedBanners) {
      try {
        const parsed = JSON.parse(cachedBanners);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBanners(parsed);
          setLoading(false);
        }
      } catch (e) {
        console.warn('Failed to parse cached bulk banners:', e);
      }
    }

    // 2. Background Sync with Backend API
    const fetchActiveBulkBanners = async () => {
      try {
        if (!cachedBanners) setLoading(true);

        const response = await axiosInstance.get<any[]>('/bulk-banners');
        const processedBanners = (response.data || [])
          .map(banner => ({ ...banner, id: banner._id || banner.id }))
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

        setBanners(processedBanners);
        localStorage.setItem('bulk_banners', JSON.stringify(processedBanners));
      } catch (error) {
        console.error('Failed to fetch bulk banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBulkBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, banners.length]);

  if (loading && banners.length === 0) {
    return <div className={styles.heroPlaceholder} />;
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className={styles.heroWrapper}>
      {banners.map((banner, index) => (
        <div
          key={banner.id || index}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
        >
          <Link href={banner.link || '#'} className={styles.bannerLink}>
            <Image
              src={banner.imageUrl}
              alt={banner.title || 'Bulk Banner'}
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
}
