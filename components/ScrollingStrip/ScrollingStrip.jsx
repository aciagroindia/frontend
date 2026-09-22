import Image from "next/image";
import styles from "./ScrollingStrip.module.css";

export default function CertifiedStrip() {
  const items = [
    { text: "No Artificial Colors or Flavors", icon: "/certifiedIcons/Asset_12.svg" },
    { text: "Certified Organic Products", icon: "/certifiedIcons/Asset_15.svg" },
    { text: "Sourced Directly from Farmers", icon: "/certifiedIcons/Asset_16.svg" },
    { text: "Maximize Farmers Profit", icon: "/certifiedIcons/Asset_13.svg" },
    { text: "100% Natural Herbs", icon: "/certifiedIcons/Asset_14.svg" },
    { text: "No Added Sugar", icon: "/certifiedIcons/Asset_17.svg" },
  ];

  return (
    <section className={styles.wrapper}>
      <div className={styles.marquee}>
        {[...items, ...items].map((item, index) => (
          <div key={index} className={styles.item}>
            <Image
              src={item.icon}
              alt={item.text}
              width={40}
              height={40}
              className={styles.icon}
            />
            <span className={styles.text}>{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
