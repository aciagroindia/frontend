import styles from "./PillarSection.module.css";

export default function PillarSection() {
  return (
    <section className={styles.pillar}>
      <h2>VEDIST PILLAR</h2>

      <div className={styles.grid}>
        <div>
          <h3>100% NATURAL</h3>
          <p>All products are sourced naturally.</p>
        </div>

        <div>
          <h3>CERTIFIED PRODUCTS</h3>
          <p>Certified and follows regulations.</p>
        </div>

        <div>
          <h3>DIRECTLY FROM FARM</h3>
          <p>Ingredients directly from farms.</p>
        </div>

        <div>
          <h3>MAXIMIZE FARMER PROFITS</h3>
          <p>Farmers get maximum profits.</p>
        </div>
      </div>
    </section>
  );
}