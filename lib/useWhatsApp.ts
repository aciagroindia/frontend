"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

export interface WhatsAppConfigData {
  phoneNumber?: string;
  message?: string;
  customUrl?: string;
  isEnabled?: boolean;
}

const DEFAULT_PHONE = "917597920642";
const DEFAULT_MSG = "Hello ACI Agro Solutions, I would like to inquire about your products.";

export const buildWhatsAppUrl = (config?: WhatsAppConfigData | null): string => {
  if (config?.customUrl && config.customUrl.trim()) {
    return config.customUrl.trim();
  }

  const cleanPhone = (config?.phoneNumber || DEFAULT_PHONE).replace(/[^0-9]/g, "");
  const encodedMsg = encodeURIComponent(config?.message || DEFAULT_MSG);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
};

export function useWhatsApp() {
  const [config, setConfig] = useState<WhatsAppConfigData>({
    phoneNumber: DEFAULT_PHONE,
    message: DEFAULT_MSG,
    customUrl: "",
    isEnabled: true,
  });
  const [whatsappUrl, setWhatsappUrl] = useState<string>(buildWhatsAppUrl());

  useEffect(() => {
    let isMounted = true;
    const fetchConfig = async () => {
      try {
        const res = await axiosInstance.get("/config/whatsapp");
        if (res.data?.success && res.data?.data && isMounted) {
          setConfig(res.data.data);
          setWhatsappUrl(buildWhatsAppUrl(res.data.data));
        }
      } catch (err) {
        // Fallback default url already set
      }
    };

    fetchConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  const openWhatsApp = () => {
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  return {
    config,
    whatsappUrl,
    isEnabled: config.isEnabled !== false,
    openWhatsApp,
  };
}
