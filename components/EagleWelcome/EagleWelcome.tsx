"use client";
import { useEffect, useState } from "react";
import styles from "./EagleWelcome.module.css";

export default function EagleWelcome() {
  const [visible, setVisible] = useState(true);
  const [landed, setLanded] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!visible) return;

    setLanded(false);
    setWelcomeOpen(false);
  }, [visible, run]);

  if (!visible) {
    return null;
  }

  const dismissWelcome = () => {
    setVisible(false);
  };

  return (
    <aside
      className={styles.widget}
      aria-label="Welcome to ACI Agro Solution"
    >
      <div className={`${styles.eagle} ${landed ? styles.landed : styles.flying}`}>
        <video
          key={run}
          className={styles.eagleImage}
          src="/eagle-flight-transparent.webp"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => {
            setLanded(true);
            setWelcomeOpen(true);
          }}
        />
      </div>

      {welcomeOpen && (
        <section className={styles.welcome} role="status">
          <button
            type="button"
            className={styles.closeMessage}
            onClick={() => setWelcomeOpen(false)}
            aria-label="Close welcome message"
          >
            ×
          </button>

          <p className={styles.eyebrow}>A WARM WELCOME</p>
          <h2>Welcome to ACI Agro Solution!</h2>
          <p>Discover our range of nature-inspired products.</p>

          <a
            href="/products"
            className={styles.explore}
            onClick={dismissWelcome}
          >
            Explore Products →
          </a>
        </section>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => setRun((value) => value + 1)}
          aria-label="Replay eagle animation"
          title="Replay"
        >
          ↻
        </button>
        <button
          type="button"
          onClick={dismissWelcome}
          aria-label="Close eagle welcome"
          title="Close"
        >
          ×
        </button>
      </div>
    </aside>
  );
}
