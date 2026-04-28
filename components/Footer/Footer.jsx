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
            alt="Vedist Organic"
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
                <Image src="/assets/phone.svg" alt="" width={20} height={20} />
                 +91-4552115456</p>
            <p>
              <Image src="/assets/Email.svg" alt="" width={20} height={20} />
              info@ACIagro.com
            </p>
          </div>

          <div className={styles.socials}>
            <a href="#" className={styles.icon}><Facebook size={24} /></a>
            <a href="#" className={styles.icon}><Instagram size={24} /></a>
            <a href="#" className={styles.icon}><Youtube size={24} /></a>
            <a href="#" className={styles.icon}><Linkedin size={24} /></a>
          </div> 
        </div>

        {/* Column 2 */}
        <div className={styles.col}>
          <h3 className={styles.heading}>CATEGORIES</h3>
          <ul className={styles.list}>
            <li>
              <Link href="#">Shop All</Link>
            </li>
            <li>
              <Link href="#">Herbal Juices</Link>
            </li>
            <li>
              <Link href="#">Herbal Tablets</Link>
            </li>
            <li>
              <Link href="#">Herbal Powders</Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className={styles.col}>
          <h3 className={styles.heading}>QUICK LINKS</h3>
          <ul className={styles.list}>
            <li>
              <Link href="#">Articles</Link>
            </li>
            <li>
              <Link href="#">Contact Us</Link>
            </li>
            <li>
              <Link href="#">Our Company</Link>
            </li>
            <li>
              <Link href="#">Search</Link>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className={styles.col}>
          <h3 className={styles.heading}>OUR POLICIES</h3>
          <ul className={styles.list}>
            <li>
              <Link href="#">Privacy Policy</Link>
            </li>
            <li>
              <Link href="#">Cancellation Policy</Link>
            </li>
            <li>
              <Link href="#">Shipping Policy</Link>
            </li>
            <li>
              <Link href="#">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>Developed By Sarvamidam Tech Experts</div>
    </footer>
  );
}
