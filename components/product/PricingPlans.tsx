"use client";

import styles from "./PricingPlans.module.css";

export interface Plan {
  id: number | string;
  month: string;
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
  return (
    <div className={styles.wrapper}>
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`${styles.card} ${
            selectedPlan.id === plan.id ? styles.active : ""
          }`}
          onClick={() => onPlanSelect(plan)}
        >
          <div className={styles.cardLeft}>
            <span className={styles.month}>{plan.month}</span>
            <span className={styles.details}>{plan.details}</span>
          </div>
          <div className={styles.cardRight}>
            <span className={styles.price}>₹{plan.price}</span>
            <span className={styles.badge}>{plan.badge}</span>
          </div>
        </div>
      ))}
    </div>
  );
}