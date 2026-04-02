"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./Certificate.module.css";

interface Certificate {
  _id: string;
  title: string;
  image: string;
}

export default function CertificatesSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axiosInstance.get("/certificates");
        if (res.data.success) {
          setCertificates(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  if (loading || certificates.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Certified for Quality & Authenticity 🏆</h2>
      <p className={styles.subtext}>
        Our products are manufactured and tested under strict quality standards.
      </p>

      <div className={styles.grid}>
        {certificates.map((cert) => (
          <div key={cert._id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                className={styles.image}
              />
            </div>
            <p className={styles.title}>{cert.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}