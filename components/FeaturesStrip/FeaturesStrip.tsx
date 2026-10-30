
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
    title: "NATURE INSPIRED",
    description: "Carefully Selected Ingredients",
  },
  {
    icon: "/certifiedIcons/Asset_15.svg",
    title: "QUALITY ASSURED",
    description: "Quality Checked Products",
  },
  {
    icon: "/certifiedIcons/Asset_15.svg",
    title: "SECURE CHECKOUT",
    description: "Safe & Secure Payments",
  },
  {
    icon: "/certifiedIcons/Asset_15.svg",
    title: "DEDICATED SUPPORT",
    description: "Here to Help You",
  },
];

export default function FeaturesStrip() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {featuresData.map((item, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.icon}>
              <Image
                src={item.icon}
                alt={item.title}
                width={40}
                height={40}
              />
            </div>

            <h4 className={styles.title}>{item.title}</h4>
            <p className={styles.description}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
        
