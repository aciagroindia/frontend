import styles from "./FilterSortBar.module.css";

export default function FilterSortBar() {
  console.log("FilterSortBar mounted");
  return (
    <div className={styles.bar}>
      <div className={styles.left}>Filters</div>
      <div className={styles.right}>Sort</div>
    </div>
  );
}
