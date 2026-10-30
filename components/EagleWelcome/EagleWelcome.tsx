"use client";
import { useState } from "react";
import styles from "./EagleWelcome.module.css";

export default function EagleWelcome() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside className={styles.widget} aria-label="ACI welcome">
      {/* Separate floating logo */}
      <div className={styles.logoArea}>
        <img
          src="/aci-welcome-logo.png"
          alt="ACI Agro Solution"
          className={styles.logo}
        />
      </div>

      {/* Separate welcome message */}
      <section className={styles.welcome}>
        <button
          type="button"
          className={styles.closeMessage}
          onClick={() => setVisible(false)}
          aria-label="Close welcome message"
        >
          ×
        </button>

        <p className={styles.eyebrow}>A WARM WELCOME</p>

        <h2>Welcome to ACI Agro Solution!</h2>

        <p>Discover our range of nature-inspired products.</p>

        <a href="https://aciagro.com/about" className={styles.explore}>
          About →
        </a>
      </section>
    </aside>
  );
}
