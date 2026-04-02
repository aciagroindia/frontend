"use client";

import Image from "next/image";
import styles from "./WhyChooseUs.module.css";

export default function WhyChooseUs() {
  return (
    <section className={styles.section}>
      <h2 className={styles.mainHeading}>WHY CHOOSE US</h2>

      <div className={styles.container}>
        {/* LEFT CONTENT */}
        <div className={styles.content}>
          <span className={styles.tag}>ROOTED IN TRADITION</span>

          <h2 className={styles.heading}>
            Crafted by Nature. <br />
            <span>Powered by ACI.</span>
          </h2>

          <p className={styles.description}>
            ACI me hum ancient Ayurvedic wisdom ko modern science ke saath
            combine karke aise products banate hain jo aapke body ko naturally
            nourish kare. Har ingredient carefully source kiya jata hai,
            ethically process hota hai, aur proper testing ke baad hi use hota
            hai — taaki aapko mile pure, natural aur trusted wellness.
          </p>

          <div className={styles.points}>
            <div>
              <strong>✔ 100% Natural</strong>
              <p>No artificial additives or preservatives.</p>
            </div>

            <div>
              <strong>✔ Ethically Sourced</strong>
              <p>Direct partnerships with trusted farmers.</p>
            </div>

            <div>
              <strong>✔ Lab Tested</strong>
              <p>Strict quality control for every batch.</p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageBg}></div>
          <Image
            src="/certifiedIcons/whychooseus.png"
            alt="ACI Product"
            fill
            className={styles.image}
            sizes="(max-width: 768px) 80vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}
