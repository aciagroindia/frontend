"use client";

import { useEffect, useState } from "react";
import styles from "./EagleWelcome.module.css";

export default function EagleWelcome() {
  const [visible, setVisible] = useState(true);
  const [landed, setLanded] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [run, setRun] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setLanded(false);
    setWelcomeOpen(false);
    setImageError(false);

    const landingTimer = window.setTimeout(() => {
      setLanded(true);
    }, 4000);

    const welcomeTimer = window.setTimeout(() => {
      setWelcomeOpen(true);
    }, 4400);

    return () => {
      window.clearTimeout(landingTimer);
      window.clearTimeout(welcomeTimer);
    };
  }, [visible, run]);

  if (!visible) return null;

  const dismissWelcome = () => {
    setVisible(false);
  };

  const replayEagle = () => {
    setLanded(false);
    setWelcomeOpen(false);
    setImageError(false);
    setRun((value) => value + 1);
  };

  return (
    <aside
      className={styles.widget}
      aria-label="Welcome to ACI Agro Solution"
    >
      <div
        className={`${styles.eagle} ${
          landed ? styles.landed : styles.flying
        }`}
      >
        <img
          key={run}
          className={styles.eagleImage}
          src="/eagle-flight-transparent.webp"
          alt="Eagle flying"
          onLoad={() => setImageError(false)}
          onError={() => {
            setImageError(true);
            console.error("Eagle animation failed to load");
          }}
        />

        {imageError && (
          <p role="alert">
            Eagle animation could not load. Please check the image file.
          </p>
        )}
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
            href="https://aciagro.com/about"
            className={styles.explore}
            onClick={dismissWelcome}
          >
            About →
          </a>
        </section>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          onClick={replayEagle}
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
