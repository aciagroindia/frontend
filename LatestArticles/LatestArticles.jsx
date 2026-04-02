"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; 
import styles from "./LatestArticles.module.css";

const articles = [
  {
    id: 1,
    title: "The Power of Ashwagandha for Stress Relief",
    description:
      "Ashwagandha, an ancient herb, helps balance stress and boosts immunity naturally.",
    img: "/certifiedIcons/latestArticle1.png",
    // 👈 FIX: Link ko naye dynamic route format me update kiya
    link: "/blogs/articles/how-to-use-ashwagandha-powder-with-water", 
    date: "February 10, 2026",
  },
  {
    id: 2,
    title: "5 Ayurvedic Tips for Healthy Digestion",
    description:
      "Discover simple Ayurvedic practices that improve digestion and gut health.",
    img: "/certifiedIcons/latestArticle2.png",
    link: "/blogs/articles/digestion-tips",
    date: "February 5, 2026",
  },
  {
    id: 3,
    title: "Why Turmeric is the Golden Spice for Immunity",
    description:
      "Learn how turmeric supports your immune system and overall wellness.",
    img: "/certifiedIcons/latestArticle3.png",
    link: "/blogs/articles/turmeric",
    date: "January 28, 2026",
  },
];

export default function LatestArticles() {
  const router = useRouter(); 

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>LATEST ARTICLES</h2>

        <div className={styles.grid}>
          {articles.map((article) => (
            <article 
              key={article.id} 
              className={styles.card}
              // 👈 FIX: Poore card ko clickable bana diya
              onClick={() => router.push(article.link)}
              style={{ cursor: "pointer" }} // Taki mouse hover karne par pointer icon (hand) aaye
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={article.img}
                  alt={article.title}
                  fill
                  className={styles.image}
                  priority
                />
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{article.title}</h3>
                <p className={styles.description}>{article.description}</p>
                <p className={styles.date}>{article.date}</p>
              </div>
            </article>
          ))}
        </div>
        
        <button 
          className={styles.viewAllButton}
          onClick={() => router.push("/blogs/articles")} 
        >
          VIEW ALL
        </button>
      </div>
    </section>
  );
}