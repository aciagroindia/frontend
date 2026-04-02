import styles from "./CollectionHero.module.css";

export default function CollectionHero({ title, description }) {
  console.log("CollectionHero props:", { title });
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </section>
  );
}
