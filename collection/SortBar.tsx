import styles from "./SortBar.module.css";
import { SortOption } from "./CollectionLayout";

interface SortBarProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export default function SortBar({ sortOption, onSortChange }: SortBarProps) {
  return (
    <div className={styles.sortBar}>
      <span>Sort by:</span>
      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
      >
        <option value="best-selling">Best selling</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}