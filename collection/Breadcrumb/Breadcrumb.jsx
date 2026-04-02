"use client";

import Link from "next/link";
import styles from "./Breadcrumb.module.css";

export default function Breadcrumb({ crumbs }) {
  // crumbs: [{ name: "Home", href: "/" }, { name: "Collections", href: "/collections" }, { name: "Diabetes Care" }]
  if (!crumbs || crumbs.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.list}>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={index} className={styles.item}>
              {isLast ? (
                <span className={styles.current}>{crumb.name}</span>
              ) : (
                <>
                  <Link href={crumb.href} className={styles.link}>
                    {crumb.name}
                  </Link>
                  <span className={styles.separator}>›</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}