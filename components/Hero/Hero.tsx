"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';
import axiosInstance from '@/utils/axiosInstance';

// Backend se aane wala Banner ka structure
export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  order: number;
}

interface HeroProps {
  initialBanners?: Banner[];
}

const getCloudinaryUrl = (src: string, width = 1200, quality = "auto") => {
  if (!src || !src.includes("res.cloudinary.com")) return src;
  const params = `f_auto,q_${quality},w_${width},c_limit`;
  return src.replace("/upload/", `/upload/${params}/`);
};

const Hero = ({ initialBanners = [] }: HeroProps) => {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(initialBanners.length === 0);
  const [secondarySlidesMounted, setSecondarySlidesMounted] = useState(false);

  useEffect(() => {
    // If initialBanners are already provided via SSR, no need to immediately fetch
    if (initialBanners && initialBanners.length > 0) {
      return;
    }

    let isMounted = true;
    let cachedBanners: string | null = null;
    try {
      cachedBanners = localStorage.getItem('hero_banners');
      if (cachedBanners && isMounted) {
        const parsed = JSON.parse(cachedBanners);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBanners(parsed);
          setLoading(false);
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached hero banners:', e);
    }

    const fetchActiveBanners = async () => {
      try {
        if (!cachedBanners && isMounted) setLoading(true); 

        const response = await axiosInstance.get<any[]>('/banners');
        if (!isMounted) return;
        const processedBanners = (response.data || [])
          .map(banner => ({ ...banner, id: banner._id || banner.id }))
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

        if (isMounted) {
          setBanners(processedBanners);
          try {
            localStorage.setItem('hero_banners', JSON.stringify(processedBanners));
          } catch (_) {}
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActiveBanners();

    return () => {
      isMounted = false;
    };
  }, [initialBanners]);

  // Mount secondary slides shortly before first slide transition so initial LCP isn't blocked
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setTimeout(() => {
      setSecondarySlidesMounted(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, [banners.length]);

  // Carousel auto-advance
  useEffect(() => {
    if (banners.length > 1) {
      const timer = setTimeout(() => {
        setSecondarySlidesMounted(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, banners.length]);

  const handleDotClick = useCallback((idx: number) => {
    setSecondarySlidesMounted(true);
    setCurrentIndex(idx);
  }, []);

  if (loading) {
    return <div className={styles.heroPlaceholder} />;
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className={styles.heroWrapper}>
      {banners.map((banner, index) => {
        // Initial SSR and initial paint strictly only renders slide 0
        if (index !== 0 && !secondarySlidesMounted && index !== currentIndex) {
          return null;
        }

        const isFirst = index === 0;
        const rawUrl = banner.imageUrl;
        const isCloudinary = rawUrl && rawUrl.includes("res.cloudinary.com");
        const optimizedSrc = isCloudinary ? getCloudinaryUrl(rawUrl, 1200) : rawUrl;
        const srcSet = isCloudinary
          ? `${getCloudinaryUrl(rawUrl, 640)} 640w, ${getCloudinaryUrl(rawUrl, 750)} 750w, ${getCloudinaryUrl(rawUrl, 1080)} 1080w, ${getCloudinaryUrl(rawUrl, 1200)} 1200w`
          : undefined;

        return (
          <div
            key={banner.id}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
          >
            <Link href={banner.link || '#'} className={styles.bannerLink} prefetch={false}>
              <img
                src={optimizedSrc}
                srcSet={srcSet}
                alt={banner.title || "ACI Agro Solutions banner"}
                width={1200}
                height={406}
                loading={isFirst ? "eager" : "lazy"}
                fetchPriority={isFirst ? "high" : "auto"}
                className={styles.bannerImg}
                sizes="100vw"
                decoding="async"
              />
            </Link>
          </div>
        );
      })}

      {banners.length > 1 && (
        <div className={styles.indicators}>
          {banners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;