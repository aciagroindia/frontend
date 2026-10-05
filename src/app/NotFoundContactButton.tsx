"use client";

import { useWhatsApp } from "@/lib/useWhatsApp";

export default function NotFoundContactButton() {
  const { whatsappUrl } = useWhatsApp();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        padding: "12px 24px",
        backgroundColor: "#f3f4f6",
        color: "#374151",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "0.95rem",
        textDecoration: "none",
        border: "1px solid #d1d5db",
      }}
    >
      Contact Support
    </a>
  );
}
