"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    gapi?: any;
    renderOptIn?: () => void;
  }
}

export interface GoogleCustomerReviewsOptInProps {
  orderId: string;
  customerEmail: string;
  deliveryCountry?: string; // Default: 'IN'
  estimatedDeliveryDate?: string; // Format: 'YYYY-MM-DD'
  products?: { gtin?: string }[];
  optInStyle?:
    | "CENTER_DIALOG"
    | "BOTTOM_RIGHT_DIALOG"
    | "BOTTOM_LEFT_DIALOG"
    | "TOP_RIGHT_DIALOG"
    | "TOP_LEFT_DIALOG"
    | "BOTTOM_TRAY";
}

/**
 * Calculates expected delivery date (Default: +6 days for Delhivery standard pan-India delivery)
 * Returns date strictly formatted as YYYY-MM-DD
 */
export function calculateEstimatedDeliveryDate(
  orderDate?: string | Date,
  daysToAdd = 6
): string {
  const date = orderDate ? new Date(orderDate) : new Date();
  const validDate = isNaN(date.getTime()) ? new Date() : date;
  validDate.setDate(validDate.getDate() + daysToAdd);
  const year = validDate.getFullYear();
  const month = String(validDate.getMonth() + 1).padStart(2, "0");
  const day = String(validDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Google Customer Reviews Survey Opt-In Component
 * Follows official Google Merchant Center specifications:
 * - Merchant ID: 5317000737
 * - Dynamically passes actual order data (order_id, email, delivery_country, estimated_delivery_date)
 * - Prevents duplicate tracking across page refreshes via sessionStorage
 * - Zero PII logged to browser console or public config
 */
export default function GoogleCustomerReviewsOptIn({
  orderId,
  customerEmail,
  deliveryCountry = "IN",
  estimatedDeliveryDate,
  products,
  optInStyle = "CENTER_DIALOG",
}: GoogleCustomerReviewsOptInProps) {
  const renderedRef = useRef(false);

  useEffect(() => {
    // 1. Guard against missing required fields or server-side rendering
    if (typeof window === "undefined" || !orderId || !customerEmail) {
      return;
    }

    // 2. Prevent duplicate execution in the same component render cycle
    if (renderedRef.current) {
      return;
    }

    // 3. Prevent duplicate tracking on page refresh across session
    const storageKey = `gcr_optin_tracked_${orderId}`;
    try {
      if (sessionStorage.getItem(storageKey) === "true") {
        return;
      }
    } catch (e) {
      // Ignore private browsing storage restriction errors
    }

    const cleanEmail = customerEmail.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return;
    }

    const finalDeliveryDate =
      estimatedDeliveryDate || calculateEstimatedDeliveryDate();

    // 4. Opt-in configuration strictly adhering to Google Customer Reviews schema
    const optInConfig: Record<string, any> = {
      merchant_id: 5317000737,
      order_id: String(orderId),
      email: cleanEmail,
      delivery_country: deliveryCountry || "IN",
      estimated_delivery_date: finalDeliveryDate,
      opt_in_style: optInStyle || "CENTER_DIALOG",
    };

    if (products && products.length > 0) {
      const validGtins = products
        .filter((p) => p && p.gtin && p.gtin.trim())
        .map((p) => ({ gtin: p.gtin!.trim() }));
      if (validGtins.length > 0) {
        optInConfig.products = validGtins;
      }
    }

    // 5. Execution function safely loading surveyoptin module
    const executeRender = () => {
      try {
        if (
          window.gapi &&
          window.gapi.surveyoptin &&
          typeof window.gapi.surveyoptin.render === "function"
        ) {
          window.gapi.surveyoptin.render(optInConfig);
          renderedRef.current = true;
          try {
            sessionStorage.setItem(storageKey, "true");
          } catch (e) {}
        } else if (window.gapi && typeof window.gapi.load === "function") {
          window.gapi.load("surveyoptin", () => {
            if (
              window.gapi.surveyoptin &&
              typeof window.gapi.surveyoptin.render === "function"
            ) {
              window.gapi.surveyoptin.render(optInConfig);
              renderedRef.current = true;
              try {
                sessionStorage.setItem(storageKey, "true");
              } catch (e) {}
            }
          });
        }
      } catch (err) {
        // Silently capture errors without exposing customer email or PII
      }
    };

    // Register global callback for when Google platform script finishes loading
    window.renderOptIn = function () {
      executeRender();
    };

    // 6. Check if Google platform.js script is already in document
    const SCRIPT_ID = "google-customer-reviews-platform-script";
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://apis.google.com/js/platform.js?onload=renderOptIn";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      // Script already loaded, trigger execution directly
      executeRender();
    }
  }, [
    orderId,
    customerEmail,
    deliveryCountry,
    estimatedDeliveryDate,
    optInStyle,
    products,
  ]);

  return null; // Headless integration, renders native Google dialog
}
