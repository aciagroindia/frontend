import styles from "./Testimonials.module.css";

export default function Testimonials({ initialTestimonials = [] }) {
  const testimonials = initialTestimonials;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>REAL CUSTOMERS REAL RESULTS</h2>
        <p className={styles.sub}>What customers are saying about ACI?</p>

        <div className={styles.sliderWrapper}>
          <div className={styles.track}>
            {[...testimonials, ...testimonials].map((item, index) => (
              <div key={`${item.id}-${index}`} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "#2e7d32",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.name ? item.name.charAt(0) : ""}
                  </div>
                </div>

                <h4 className={styles.name}>{item.name}</h4>

                <div className={styles.rating}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < item.rating ? "#2e7d32" : "#e0e0e0",
                        fontSize: "1.2rem",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className={styles.text}>"{item.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}