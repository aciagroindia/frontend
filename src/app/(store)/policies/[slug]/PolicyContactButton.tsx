"use client";

import { useWhatsApp } from "@/lib/useWhatsApp";
import styles from "./Policy.module.css";

export default function PolicyContactButton() {
  const { whatsappUrl } = useWhatsApp();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.contactBtn}
    >
      Contact Support
    </a>
  );
}
