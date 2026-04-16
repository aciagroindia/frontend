"use client";

import { useState, useEffect } from 'react';

// E-commerce ke according basic hardcoded headings
const announcements = [
  "🌿 100% Pure & Organic Ayurvedic Solutions",
  "🚚 Free Shipping on all orders above ₹999!",
  "⚡ Flash Sale: Get 20% Off on Bestsellers",
  "🛡️ Safe, Secure & 100% Trusted Payments"
];

export default function TopAnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Har 3 second me heading change karne ka logic
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black text-white py-2 overflow-hidden relative h-10 flex items-center justify-center border-b border-red-600 z-50">
      <div className="relative w-full max-w-4xl mx-auto flex justify-center items-center h-full">
        {announcements.map((text, index) => (
          <p
            key={index}
            className={`absolute text-sm md:text-base font-medium transition-all duration-700 ease-in-out w-full text-center px-4
              ${
                index === currentIndex
                  ? "opacity-100 translate-y-0" // Active text center me dikhega
                  : "opacity-0 -translate-y-4 pointer-events-none" // Baaki text upar fade out ho jayenge
              } 
              hover:text-red-500 cursor-default`}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}