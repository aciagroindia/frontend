
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

    const landingTimer = window.setTimeout(() => {
      setLanded(true);
    }, 2800);

    const welcomeTimer = window.setTimeout(() => {
      setWelcomeOpen(true);
    }, 3400);

    return () => {
      window.clearTimeout(landingTimer);
      window.clearTimeout(welcomeTimer);
    };
  }, [visible, run]);

  if (!visible) {
    return (
      <button
        type="button"
        className={styles.reopen}
        onClick={() => {
          setVisible(true);
          setRun((value) => value + 1);
        }}
        aria-label="Show eagle welcome"
        title="Welcome"
      >
        🦅
      </button>
    );
  }

  return (
    <aside className={styles.widget} aria-label="Welcome to ACI Agro Solution">
      <div
        key={run}
        className={`${styles.eagle} ${
          landed ? styles.landed : styles.flying
        }`}
        aria-hidden="true"
      >
        <img
          src="/eagle-perched.webp.png"
          alt=""
          className={styles.eagleImage}
        />
        {!landed && <span className={styles.flightFallback}>🦅</span>}
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

          <a href="/products" className={styles.explore}>
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
          onClick={() => setVisible(false)}
          aria-label="Close eagle welcome"
          title="Close"
        >
          ×
        </button>
      </div>
    </aside>
  );
}
