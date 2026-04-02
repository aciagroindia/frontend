import styles from "./FeaturesStrip.module.css";
import Image from "next/image";

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

const featuresData: FeatureItem[] = [
  {
    icon: "/certifiedIcons/Asset_15.svg",
    title: "FREE SHIPPING",
    description: "For all orders above 499",
  },
  {
    icon: "/certifiedIcons/Asset_15.svg",
    title: "SECURE PAYMENT",
    description: "Protect online payment.",
  },
  {
    icon: "/certifiedIcons/Asset_15.svg",
    title: "QUALITY ASSURED",
    description: "100% quality assured products.",
  },
  {
    icon: "/certifiedIcons/Asset_15.svg",
    title: "SUPPORT ONLINE",
    description: "Support available 9AM to 6PM",
  },
];

export default function FeaturesStrip() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {featuresData.map((item, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.icon}>
              <Image src={item.icon} alt={item.title} width={40} height={40} />
            </div>
            <h4 className={styles.title}>{item.title}</h4>
            <p className={styles.description}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}