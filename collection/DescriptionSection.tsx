"use client";
import { useState } from "react";
import styles from "./DescriptionSection.module.css";

interface Props {
  title?: string;
  description?: string;
}

export default function DescriptionSection({ title, description }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>

          {title && (
            <h1 className={styles.title}>{title}</h1>
          )}

          <div 
            className={`${styles.description} ${!expanded ? styles.collapsed : ""}`}
            dangerouslySetInnerHTML={{ __html: description }}
          />

          {/* Simple heuristic: if description length is long, show Read More */}
          {description.length > 500 && (
            <button
              className={styles.readMoreBtn}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Read Less" : "Read More"}
            </button>
          )}

        </div>
      </div>
    </section>
  );
}