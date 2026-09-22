"use client";

import { useState, useEffect } from "react";
import styles from "./WhatsAppButton.module.css";
import axiosInstance from "@/utils/axiosInstance";

interface WhatsAppConfigData {
  phoneNumber?: string;
  message?: string;
  customUrl?: string;
  isEnabled?: boolean;
}

export default function WhatsAppButton() {
  const [config, setConfig] = useState<WhatsAppConfigData>({
    phoneNumber: "919876543210",
    message: "Hello ACI Agro Solutions, I would like to inquire about your ayurvedic products.",
    customUrl: "",
    isEnabled: true,
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axiosInstance.get("/config/whatsapp");
        if (res.data.success && res.data.data) {
          setConfig(res.data.data);
        }
      } catch (err) {
        // Use default fallback gracefully
      }
    };

    fetchConfig();
  }, []);

  if (config.isEnabled === false) {
    return null;
  }

  // Construct target URL
  let targetUrl = config.customUrl?.trim();
  if (!targetUrl) {
    const cleanPhone = (config.phoneNumber || "919876543210").replace(/[^0-9]/g, "");
    const encodedMsg = encodeURIComponent(
      config.message || "Hello ACI Agro Solutions, I would like to inquire about your products."
    );
    targetUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
  }

  return (
    <div className={styles.floatingContainer}>
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappBtn}
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
      >
        <span className={styles.tooltip}>Chat on WhatsApp</span>
        <svg
          viewBox="0 0 32 32"
          className={styles.whatsappIcon}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 0.5C7.44 0.5 0.5 7.44 0.5 16C0.5 18.73 1.21 21.36 2.56 23.68L0.66 30.63L7.79 28.76C10.04 29.98 12.96 30.69 16 30.69C24.56 30.69 31.5 23.75 31.5 15.19C31.5 6.63 24.56 0.5 16 0.5ZM16 28.19C13.33 28.19 10.83 27.53 8.68 26.37L8.17 26.07L3.95 27.18L5.08 23.07L4.75 22.54C3.47 20.29 2.79 17.7 2.79 15.19C2.79 7.9 8.71 1.98 16 1.98C23.29 1.98 29.21 7.9 29.21 15.19C29.21 22.48 23.29 28.19 16 28.19ZM22.57 19.34C22.21 19.16 20.44 18.29 20.11 18.17C19.78 18.05 19.54 17.99 19.3 18.35C19.06 18.71 18.38 19.51 18.17 19.75C17.96 19.99 17.75 20.02 17.39 19.84C17.03 19.66 15.87 19.28 14.49 18.05C13.41 17.09 12.68 15.9 12.47 15.54C12.26 15.18 12.45 14.98 12.63 14.8C12.79 14.64 12.99 14.38 13.17 14.17C13.35 13.96 13.41 13.81 13.53 13.57C13.65 13.33 13.59 13.12 13.5 12.94C13.41 12.76 12.69 11 12.39 10.27C12.1 9.56 11.8 9.66 11.58 9.65C11.37 9.64 11.13 9.64 10.89 9.64C10.65 9.64 10.26 9.73 9.93 10.09C9.6 10.45 8.67 11.32 8.67 13.09C8.67 14.86 9.96 16.57 10.14 16.81C10.32 17.05 12.68 20.69 16.3 22.25C17.16 22.62 17.83 22.84 18.35 23.01C19.22 23.29 20.01 23.25 20.63 23.16C21.32 23.06 22.76 22.29 23.06 21.44C23.36 20.59 23.36 19.87 23.27 19.72C23.18 19.57 22.94 19.51 22.57 19.34Z" />
        </svg>
      </a>
    </div>
  );
}
