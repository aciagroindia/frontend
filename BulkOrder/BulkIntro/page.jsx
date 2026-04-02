import React from "react";
import styles from "./page.module.css";
import ScrollingStrip from "../../../components/ScrollingStrip/ScrollingStrip";

export default function BulkIntro() {
  return (
    <>
      <section className={styles.titleContainer}>
        <h1 className={styles.title}>BULK ORDERS</h1>
      </section>
      <ScrollingStrip />
      <section className={styles.contentContainer}>
        <div className={styles.content}>
            <h2 className={styles.contentTitle}>LOOKING FOR PREMIUM AYURVEDIC SOLUTIONS IN BLUK?</h2>
            <p className={styles.contentText}>At  <span className="font-bold">ACI</span> , we offer high-quality Ayurvedic products tailored for health-conscious individuals and businesses. Whether you're a retailer, wellness center, or distributor, our bulk order options provide you with exclusive access to our herbal remedies crafted with ancient wisdom and modern precision.</p>
        </div>
      </section>
    </>
  );
}
