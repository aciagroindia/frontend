import Image from "next/image";
import Link from "next/link";
import styles from "./ShopByConcern.module.css";

const getCloudinaryUrl = (src, width = 200, quality = "auto") => {
  if (!src || !src.includes("res.cloudinary.com")) return src;
  const params = `f_auto,q_${quality},w_${width},c_limit`;
  return src.replace("/upload/", `/upload/${params}/`);
};

export default function ShopByConcern({ initialCategories = [] }) {
  const cats = initialCategories;

  return (
    <section className={styles.section}>
      <h1 className={styles.heading}>SHOP BY CATEGORY</h1>

      <div className={styles.grid}>
        {!cats || cats.length === 0 ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className={styles.card} style={{ pointerEvents: 'none' }}>
              <div className={styles.imageWrapper} style={{ background: '#f3f4f6', animation: 'pulse 1.5s infinite' }} />
              <div className={styles.name} style={{ color: '#d1d5db' }}>...</div>
            </div>
          ))
        ) : (
          cats.map((category) => {
            const rawSrc = category.image || "/certifiedIcons/product.jpeg";
            const optimizedSrc = getCloudinaryUrl(rawSrc, 200);
            return (
              <Link 
                key={category._id || category.id} 
                href={`/collections/${category.slug}`} 
                className={styles.card}
                prefetch={false}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={optimizedSrc}
                    alt={category.name}
                    width={100} 
                    height={100}
                    className={styles.image}
                    sizes="100px"
                    unoptimized={rawSrc.includes("res.cloudinary.com")}
                  />
                </div>
                <div className={styles.name}>{category.name}</div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}