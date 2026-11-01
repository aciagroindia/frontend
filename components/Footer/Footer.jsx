
"use client";

import styles from "./Footer.module.css";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import { useWhatsApp } from "@/lib/useWhatsApp";

const collections = [
  { name: "Combo Offers", slug: "combo-offers" },
  { name: "Ortho Care", slug: "ortho-carejoint--bone-wellness" },
  { name: "Herbal Juice", slug: "herbal-juicenutraceuticals-nutricosmetics--health-supplements" },
  { name: "Healthy Juice", slug: "healthy-juiceayurvedic-aaharproprietary-food--beverages" },
  { name: "Health Supplements", slug: "health-supplements-nutraceuticalsfoods-for-sports-persons" },
  { name: "Skin Glow & Beauty", slug: "skin-glow--beautynutraceuticals-nutricosmetics--health-supplements" },
  { name: "Detox & Cleanse", slug: "detox--cleanse-juicesnatural-detox-juicespurifying-wellness-drinks" },
  { name: "Aloe Vera Drinks", slug: "flavoured-aloe-vera-drinks-ready-to-drink-aloe-blendsaloe-vera-fruit-beverages" },
  { name: "Pure Herbal Drops", slug: "pure-herbal-dropsayurvedic-liquid-extractsconcentrated-wellness-drops" },
  { name: "Sugar Management", slug: "sugar-managementblood-glucose-support" },
  { name: "Weight Management", slug: "weight-loss--fat-cutweight-managementfitness--metabolism-support" },
  { name: "Food Vinegar", slug: "food-vinegarnatural-vinegarswellness-vinegars--tonicsfermented-health-drinks" },
];

const articles = [
  { name: "Our Vision for the Future", slug: "aci-agro-solution-our-vision-for-the-future" },
  { name: "Stevia Cultivation", slug: "stevia-cultivation" },
  { name: "Natural Ingredients in Wellness", slug: "the-importance-of-natural-ingredients-in-wellness-products" },
  { name: "Choosing the Right Wellness Product", slug: "how-to-choose-the-right-wellness-product" },
  { name: "Aloe Vera Juice", slug: "aloe-vera-juice-a-popular-herbal-wellness-beverage" },
  { name: "What Are Herbal Juices?", slug: "what-are-herbal-juices-a-simple-guide" },
  { name: "Papaya Cultivation", slug: "papaya-cultivation" },
  { name: "Amla Juice", slug: "amla-juice-traditional-indian-fruit-for-modern-wellness" },
  { name: "Noni Juice", slug: "noni-juice-a-natural-choice-for-everyday-wellness" },
  { name: "Guar Cultivation", slug: "guar-cultivation" },
  { name: "From Natural Ingredients to Quality Products", slug: "aci-agro-solution-from-natural-ingredients-to-quality-wellness-products" },
  { name: "Sea Buckthorn Juice", slug: "sea-buckthorn-juice-discover-the-nutrient-rich-berry" },
  { name: "Pomegranate Cultivation", slug: "pomegranate-cultivation" },
];

export default function Footer() {
  const { whatsappUrl } = useWhatsApp();

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
            <li><Link href="/blogs/articles">Articles</Link></li>
            <li><Link href="/bulk-order">Bulk Orders</Link></li>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Contact Us
              </a>
            </li>
            <li><Link href="/about">Our Company</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className={styles.col}>
          <h3 className={styles.heading}>OUR POLICIES</h3>
          <ul className={styles.list}>
            <li><Link href="/policies/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/policies/cancellation-policy">Cancellation Policy</Link></li>
            <li><Link href="/policies/shipping-policy">Shipping Policy</Link></li>
            <li><Link href="/policies/terms-of-service">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Column 4: Collections */}
        <div className={styles.col}>
          <h3 className={styles.heading}>EXPLORE COLLECTIONS</h3>
          <ul className={`${styles.list} ${styles.exploreList}`}>
            {collections.map((collection) => (
              <li key={collection.slug}>
                <Link href={`/collections/${collection.slug}`}>
                  {collection.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 5: Articles */}
        <div className={styles.col}>
          <h3 className={styles.heading}>LATEST ARTICLES</h3>
          <ul className={`${styles.list} ${styles.exploreList}`}>
            {articles.map((article) => (
              <li key={article.slug}>
                <Link href={`/blogs/articles/${article.slug}`}>
                  {article.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        Developed By Tech Elegance Experts
      </div>
    </footer>
  );
}
