import Image from "next/image";
import Link from "next/link";
import styles from "./BlogPage.module.css";

// Real data from Vedist Organic URL
const articles = [
  {
    id: 1,
    title: "How to Use Ashwagandha Powder with Water: A Complete Guide",
    date: "MAR 01, 2026",
    description: "Quick Answer: Ashwagandha powder can be easily consumed by mixing half to one teaspoon in 200 to 300 milliliters of lukewarm water...",
    slug: "how-to-use-ashwagandha-powder-with-water",
    img: "/certifiedIcons/product.jpeg", 
  },
  {
    id: 2,
    title: "Best Ashwagandha Powder Brand in India (2026) — Complete Guide",
    date: "FEB 25, 2026",
    description: "Quick Answer: The best ashwagandha powder brand in India is one that ensures pure root powder, organic sourcing, lab-tested quality...",
    slug: "best-ashwagandha-powder-brand",
    img: "/certifiedIcons/product.jpeg",
  },
  {
    id: 3,
    title: "Symptoms of High and Low Blood Pressure: Signs & Natural Management",
    date: "FEB 20, 2026",
    description: "Quick Answer: High blood pressure and low blood pressure are common cardiovascular conditions that can affect overall health...",
    slug: "symptoms-high-low-blood-pressure",
    img: "/certifiedIcons/product.jpeg",
  },
  {
    id: 4,
    title: "Joint Care Tablets Uses: Benefits & Why You Should Include Them",
    date: "FEB 15, 2026",
    description: "Quick Answer: Joint care tablets uses primarily include relieving joint pain, reducing stiffness, improving mobility, and supporting long-term joint health...",
    slug: "joint-care-tablets-uses",
    img: "/certifiedIcons/product.jpeg",
  },
  {
    id: 5,
    title: "Is Sabudana Good for Diabetes? A Complete Guide for Healthy Blood Sugar",
    date: "FEB 10, 2026",
    description: "Quick Answer: Sabudana, also known as tapioca pearls, is a starchy food with a high carbohydrate content and a high glycemic index...",
    slug: "is-sabudana-good-for-diabetes",
    img: "/certifiedIcons/product.jpeg",
  },
  {
    id: 6,
    title: "Benefits of Ashwagandha Powder With Milk: Health and Wellness",
    date: "FEB 05, 2026",
    description: "Quick Answer: The benefits of ashwagandha powder with milk include reducing stress, improving sleep quality, boosting immunity...",
    slug: "benefits-ashwagandha-powder-with-milk",
    img: "/certifiedIcons/product.jpeg",
  }
];

export default function ArticlesPage() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.heading}>ARTICLES</h1>
          <p className={styles.subtitle}>
            Explore Wellness Tips & Ayurvedic Solutions from our experts.
          </p>
        </div>

        {/* Grid matching your LatestArticles layout */}
        <div className={styles.grid}>
          {articles.map((article) => (
            <Link 
              key={article.id} 
              href={`/blogs/articles/${article.slug}`} 
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={article.img}
                  alt={article.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className={styles.content}>
                <span className={styles.date}>{article.date}</span>
                <h2 className={styles.title}>{article.title}</h2>
                <p className={styles.description}>{article.description}</p>
                <div className={styles.readMore}>
                  Read More <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination matched to your theme */}
        <div className={styles.pagination}>
          <button className={styles.pageBtn} disabled>&lt;</button>
          <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>3</button>
          <button className={styles.pageBtn}>&gt;</button>
        </div>

      </div>
    </section>
  );
}