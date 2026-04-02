"use client";

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ProductCard from './ProductCard';
import styles from './RecentlyViewed.module.css';

export default function RecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const list = localStorage.getItem("recentlyViewed");
    if (list) {
      try {
        const parsed = JSON.parse(list);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed);
        }
      } catch (e) {
        setRecentlyViewed([]);
      }
    }
  }, []);

  if (!isMounted || recentlyViewed.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>RECENTLY VIEWED PRODUCTS</h2>
      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={25}
          slidesPerView={"auto"}
          navigation
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              spaceBetween: 15,
            },
            600: {
              slidesPerView: 2.5,
              spaceBetween: 20,
            },
            900: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 25,
            },
          }}
        >
          {recentlyViewed.map((product) => (
            <SwiperSlide key={product._id || product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}