"use client";

import { useState } from "react";
import styles from "./HowToUseSection.module.css";

const stepsData = [
  { id: 1, label: "Mix", detail: "Shake the bottle & add 30 ml of Joint Care Juice to a glass of water and consume 1 tablet.", img: "/steps/step1.png" },
  { id: 2, label: "Consume", detail: "Consume twice daily on an empty stomach in the morning and half an hour before dinner.", img: "/steps/step2.png" },
  { id: 3, label: "Stay Consistent", detail: "Consume daily for at least 3 months for the best results.", img: "/steps/step3.png" },
  { id: 4, label: "Safe with Others", detail: "Can be taken safely with other allopathic medicines. Keep a 15-min gap.", img: "/steps/step4.png" },
];

export default function HowToUseSection() {
  const [activeStep, setActiveStep] = useState(stepsData[0]);

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.heading}>HOW TO USE</h2>

      <div className={styles.grid}>
        {stepsData.map((step) => (
          <div
            key={step.id}
            className={`${styles.card} ${activeStep.id === step.id ? styles.active : ""}`}
            onClick={() => setActiveStep(step)}
          >
            <div className={styles.imageWrapper}>
              <img src={step.img} alt={step.label} />
            </div>
            <h3>{step.label}</h3>
          </div>
        ))}
      </div>

      <div className={styles.descriptionBox}>
        <p>{activeStep.detail}</p>
      </div>
    </section>
  );
}