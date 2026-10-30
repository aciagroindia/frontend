"use client";

import { useState } from "react";
import styles from "./EagleWelcome.module.css";

export default function EagleWelcome() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const dismissWelcome = () => {
    setVisible(false);
  };

  return (
    <aside
      className={styles.widget}
      aria-label="Welcome to ACI Agro Solution"
    >
      <section className={styles.welcome} role="status">
        <button
          type="button"
          className={styles.closeMessage}
          onClick={dismissWelcome}
          aria-label="Close welcome message"
        >
          ×
        </button>

        <img
          className={styles.logo}
          src="/images/aci-welcome-logo.png"
          alt="ACI Agro Solution Logo"
        />

        <p className={styles.eyebrow}>A WARM WELCOME</p>

        <h2>Welcome to ACI Agro Solution!</h2>

        <p>
          Discover our range of nature-inspired products.
        </p>

        <a
          href="https://aciagro.com/about"
          className={styles.explore}
          onClick={dismissWelcome}
        >
          About →
        </a>
      </section>
    </aside>
  );
}
