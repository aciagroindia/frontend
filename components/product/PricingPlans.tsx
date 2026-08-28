"use client";

import styles from "./PricingPlans.module.css";

export interface Plan {
  id: number | string;
  name: string;
  month?: string;
  details?: string;
  price: number;
  regularPrice?: number;
  badge?: string;
  discount?: number;
}

interface PricingPlansProps {
  plans: Plan[];
  selectedPlan: Plan;
  onPlanSelect: (plan: Plan) => void;
}

export default function PricingPlans({
  plans,
  selectedPlan,
  onPlanSelect,
}: PricingPlansProps) {
  if (!plans || plans.length === 0) return null;

  const currentSelection = selectedPlan?.name || selectedPlan?.month || "Standard";

  return (
    <div className={styles.selectedQuantitySection}>
      <div className={styles.header}>
        <span className={styles.label}>Selected Quantity:</span>{" "}
        <span className={styles.value}>{currentSelection}</span>
      </div>

      <div className={styles.buttonsList}>
        {plans.map((plan) => {
          const isSelected = String(selectedPlan?.id) === String(plan.id);
          const displayName = plan.name || plan.month || "Standard";

          return (
            <button
              key={plan.id}
              type="button"
              className={`${styles.quantityBtn} ${isSelected ? styles.activeBtn : ""}`}
              onClick={() => onPlanSelect(plan)}
              aria-pressed={isSelected}
            >
              {displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
