import styles from "./BenefitsSection.module.css";
import Image from "next/image";

const benefits = [
  {
    title: "Hypertension & Heart Health",
    img: "/benefit1.png",
  },
  {
    title: "Weight & Metabolism",
    img: "/benefit2.png",
  },
  {
    title: "Relax Mind & Better Sleep",
    img: "/benefit3.png",
  },
];

export default function BenefitsSection() {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>BENEFITS OF JOINT CARE KIT</h2>

      <div className={styles.grid}>
        {benefits.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageContainer} style={{ position: "relative" }}>
              <Image
                src={item.img}
                alt={item.title}
                fill
                className={styles.image}
                sizes="(max-width: 500px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className={styles.textContainer}>
              <h3>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}