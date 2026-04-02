"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./ComboOffers.module.css";

const combos = [
  {
    id: 1,
    name: "Herbal Wellness Pack",
    img: "/certifiedIcons/product.jpeg",
    price: "₹799",
    oldPrice: "₹999",
    badge: "Best Value",
    slug: "herbal-wellness-pack",
  },
  {
    id: 2,
    name: "Detox & Immunity Kit",
    img: "/certifiedIcons/product.jpeg",
    price: "₹1199",
    oldPrice: "₹1499",
    badge: "Popular",
    slug: "detox-immunity-kit",
  },
  {
    id: 3,
    name: "Organic Tea Combo",
    img: "/certifiedIcons/product.jpeg",
    price: "₹499",
    oldPrice: "₹699",
    badge: "Hot",
    slug: "organic-tea-combo",
  },
];

export default function ComboOffers() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>SPECIAL COMBO OFFERS</h2>
      <div className={styles.grid}>
        {combos.map(({ id, name, img, price, oldPrice, badge, slug }) => (
          <Link key={id} href={`/products/${slug}`} className={styles.card} aria-label={name}>
            <div className={styles.imageWrapper}>
              <Image src={img} alt={name} fill sizes="(max-width: 768px) 100vw, 33vw" />
              <div className={styles.badge}>{badge}</div>
            </div>
            <div className={styles.details}>
              <h3 className={styles.name}>{name}</h3>
              <div className={styles.price}>
                <span className={styles.current}>{price}</span>
                {oldPrice && <span className={styles.old}>{oldPrice}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
