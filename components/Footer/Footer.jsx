import styles from "./Footer.module.css";
import Image from "next/image";
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
            <a href="#" className={styles.icon} aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className={styles.icon} aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className={styles.icon} aria-label="YouTube">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
            </a>
            <a href="#" className={styles.icon} aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div> 
        </div>

        {/* Column 2 */}
        <div className={styles.col}>
          <h3 className={styles.heading}>QUICK LINKS</h3>
          <ul className={styles.list}>
            <li>
              <Link href="/blogs/articles" prefetch={false}>Articles</Link>
            </li>
            <li>
              <Link href="#" prefetch={false}>Contact Us</Link>
            </li>
            <li>
              <Link href="/about" prefetch={false}>Our Company</Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className={styles.col}>
          <h3 className={styles.heading}>OUR POLICIES</h3>
          <ul className={styles.list}>
            <li>
              <Link href="/policies/privacy-policy" prefetch={false}>Privacy Policy</Link>
            </li>
            <li>
              <Link href="/policies/cancellation-policy" prefetch={false}>Cancellation Policy</Link>
            </li>
            <li>
              <Link href="/policies/shipping-policy" prefetch={false}>Shipping Policy</Link>
            </li>
            <li>
              <Link href="/policies/terms-of-service" prefetch={false}>Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>Developed By Tech Elegance Experts</div>
    </footer>
  );
}
