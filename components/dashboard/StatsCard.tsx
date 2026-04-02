"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import styles from "./StatsCard.module.css";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: React.ReactElement;
  color: string; // Hex color code
}

export default function StatsCard({ title, value, change, isUp, icon, color }: StatsCardProps) {
  // Logic for color tint (Light version of the main color)
  const iconStyle = {
    color: color,
    backgroundColor: `${color}15`, // Adding 15 for ~10% opacity in hex
  };

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.iconWrapper} style={iconStyle}>
          {React.cloneElement(icon as React.ReactElement, { size: 22 })}
        </div>
        <div className={`${styles.changeBadge} ${isUp ? styles.up : styles.down}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>

      <div className={styles.mainContent}>
        <p className={styles.title}>{title}</p>
        <h3 className={styles.value}>{value}</h3>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerText}>vs. last month</span>
      </div>
    </div>
  );
}