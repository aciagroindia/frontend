import styles from "./FeaturesStrip.module.css";
import {
  Leaf,
  FlaskConical,
  ShieldCheck,
  Headset,
} from "lucide-react";

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const featuresData: FeatureItem[] = [
  {
    icon: Leaf,
    title: "Nature Inspired",
    description: "Carefully Selected Ingredients",
  },
  {
    icon: FlaskConical,
    title: "Quality Assured",
    description: "Quality Checked Products",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "Safe & Secure Payments",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    description: "Here to Help You",
  },
];

export default function FeaturesStrip() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.featuresGrid}>
          {featuresData.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className={styles.featureCard}>
                <div className={styles.headingRow}>
                  <Icon
                    className={styles.icon}
                    size={22}
                    strokeWidth={2}
                  />
                  <h4 className={styles.title}>{item.title}</h4>
                </div>

                <p className={styles.description}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className={styles.brandFooter}>
          ACI AGRO SOLUTIONS · CRAFTED BY NATURE
        </div>
      </div>
    </section>
  );
}
