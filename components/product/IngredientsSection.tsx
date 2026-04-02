import styles from "./IngredientsSection.module.css";
import Image from "next/image";

// Data maine aapka hi rakha hai
const ingredients = [
  {
    title: "Sarpagandha",
    desc: "Supports heart health and helps regulate blood pressure naturally.",
    img: "/certifiedIcons/ingredient1.png",
  },
  {
    title: "Ashwagandha",
    desc: "Reduces stress and promotes calmness for better wellness.",
    img: "/certifiedIcons/ingredient1.png",
  },
  {
    title: "Arjuna",
    desc: "Strengthens heart muscles and improves circulation.",
    img: "/certifiedIcons/ingredient1.png",
  },
  {
    title: "Brahmi",
    desc: "Improves mental clarity and reduces anxiety levels.",
    img: "/certifiedIcons/ingredient1.png",
  },
];

export default function IngredientsSection() {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>KEY INGREDIENTS</h2>

      <div className={styles.grid}>
        {ingredients.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageWrapper}>
              {/* Note: Ensure images exist in public folder, or use a fallback */}
              <img src={item.img} alt={item.title} width={80} height={80} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}