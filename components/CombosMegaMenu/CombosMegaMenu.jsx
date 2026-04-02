"use client";

import styles from "./CombosMegaMenu.module.css"; // Reusing styles for same UI
import Image from "next/image";
import Link from "next/link";

export default function CombosMegaMenu() {
  return (
    <div className={styles.megaMenuCombo}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div>
            <ul>
              <li><Link href="/combos/wellness" className={styles.items}>Wellness Pack</Link></li>
              <li><Link href="/combos/immunity" className={styles.items}>Immunity Kit</Link></li>
              <li><Link href="/combos/detox" className={styles.items}>Detox Special</Link></li>
            </ul>
          </div>
          <div>
            <ul>
              <li><Link href="/combos/digestion" className={styles.items}>For Digestion</Link></li>
              <li><Link href="/combos/energy" className={styles.items}>For Energy Boost</Link></li>
              <li><Link href="/combos/weight-management" className={styles.items}>Weight Management</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.right}>
          <Image
            src="/certifiedIcons/product.jpeg" // Placeholder image
            alt="Featured Combo"
            width={350}
            height={400}
          />
           <Image
            src="/certifiedIcons/product.jpeg" // Placeholder image
            alt="Featured Combo 2"
            width={350}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}