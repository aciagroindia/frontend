"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

export interface WhatsAppConfigData {
  phoneNumber?: string;
  message?: string;
  customUrl?: string;
  isEnabled?: boolean;
}

export const DEFAULT_PHONE = "917597920642";
export const DEFAULT_MSG = "Hello ACI Agro Solutions, I would like to inquire about your products.";

export const formatWhatsAppPhone = (rawPhone?: string): string => {
  if (!rawPhone) return DEFAULT_PHONE;
  
  // Remove all non-numeric characters
  let digits = rawPhone.replace(/\D/g, "");

  // Prevent duplicate '9191...' country code overlapping
  while (digits.startsWith("9191") && digits.length > 12) {
    digits = digits.substring(2);
  }

  // If 10 digits (Standard Indian Mobile), prepend country code 91
  if (digits.length === 10) {
    return `91${digits}`;
  }

  // If 11 digits starting with 0, replace 0 with 91
  if (digits.length === 11 && digits.startsWith("0")) {
    return `91${digits.substring(1)}`;
  }

  // If already 12 digits starting with 91, return as is
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }

  return digits || DEFAULT_PHONE;
};

export const buildWhatsAppUrl = (config?: WhatsAppConfigData | null): string => {
  if (config?.customUrl && config.customUrl.trim()) {
    return config.customUrl.trim();
  }

  const cleanPhone = formatWhatsAppPhone(config?.phoneNumber);
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
          const apiConfig = res.data.data;
          setConfig(apiConfig);
          setWhatsappUrl(buildWhatsAppUrl(apiConfig));
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
