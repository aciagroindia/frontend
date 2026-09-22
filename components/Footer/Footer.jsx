"use client";

import styles from "./Footer.module.css";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Column 1 */}
        <div className={styles.col}>
          <p className={styles.heading}>CRAFT BY NATURE</p>

          <Image
            src="/assets/Aci logo.png"
            alt="ACI Agro Solutions"
            width={160}
            height={60}
            className={styles.logo}
          />

          <p className={styles.desc}>
            Discover the ACI products From Farm to You, carefully
            sourced and crafted to support your health and well-being. Each item
            in the ACI Collection embodies purity, sustainability,
            and authenticity.
          </p>

          <div className={styles.contact}>
            <p>
              <Image src="/assets/phone.svg" alt="Phone" width={20} height={20} />
              <a href="tel:+917597920642">+91 75979 20642</a>
            </p>
            <p>
              <Image src="/assets/Email.svg" alt="Email" width={20} height={20} />
              <a href="mailto:director@aciagro.com">director@aciagro.com</a>
            </p>
          </div>

          <div className={styles.socials}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.icon} aria-label="Visit ACI Agro Solutions Facebook page"><Facebook size={24} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.icon} aria-label="Visit ACI Agro Solutions Instagram profile"><Instagram size={24} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.icon} aria-label="Visit ACI Agro Solutions YouTube channel"><Youtube size={24} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.icon} aria-label="Visit ACI Agro Solutions LinkedIn profile"><Linkedin size={24} /></a>
          </div> 
        </div>

       

        {/* Column 2 */}
        <div className={styles.col}>
          <h3 className={styles.heading}>QUICK LINKS</h3>
          <ul className={styles.list}>
            <li>
              <Link href="/blogs/articles">Articles</Link>
            </li>
            <li>
              <Link href="/about">Contact Us</Link>
            </li>
            <li>
              <Link href="/about">Our Company</Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className={styles.col}>
          <h3 className={styles.heading}>OUR POLICIES</h3>
          <ul className={styles.list}>
            <li>
              <Link href="/policies/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/policies/cancellation-policy">Cancellation Policy</Link>
            </li>
            <li>
              <Link href="/policies/shipping-policy">Shipping Policy</Link>
            </li>
            <li>
              <Link href="/policies/terms-of-service">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>Developed By Tech Elegance Experts</div>
    </footer>
  );
}
