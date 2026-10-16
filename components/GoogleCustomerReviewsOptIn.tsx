
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    gapi?: {
      load: (
        name: string,
        callback: () => void
      ) => void;
      surveyoptin?: {
        render: (config: Record<string, unknown>) => void;
      };
    };
    renderOptIn?: () => void;
  }
}

export interface GoogleCustomerReviewsOptInProps {
  orderId: string;
  customerEmail: string;
  deliveryCountry?: string;
  estimatedDeliveryDate?: string;
  products?: { gtin?: string }[];
  optInStyle?:
    | "CENTER_DIALOG"
    | "BOTTOM_RIGHT_DIALOG"
    | "BOTTOM_LEFT_DIALOG"
    | "TOP_RIGHT_DIALOG"
    | "TOP_LEFT_DIALOG"
    | "BOTTOM_TRAY";
}

export function calculateEstimatedDeliveryDate(
  orderDate?: string | Date,
  daysToAdd = 6
): string {
  const parsedDate = orderDate
    ? new Date(orderDate)
    : new Date();

  const date = Number.isNaN(parsedDate.getTime())
    ? new Date()
    : parsedDate;

  date.setDate(date.getDate() + daysToAdd);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

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
    if (!orderId || !customerEmail?.trim()) return;
    if (renderedRef.current) return;

    const storageKey = `gcr_optin_tracked_${orderId}`;

    try {
      if (sessionStorage.getItem(storageKey) === "true") {
        return;
      }
    } catch {
      // Continue if sessionStorage is unavailable.
    }

    const email = customerEmail.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.warn(
        "[Google Customer Reviews] Invalid customer email."
      );
      return;
    }

    if (!/^[A-Z]{2}$/.test(deliveryCountry)) {
      console.warn(
        "[Google Customer Reviews] Invalid delivery country."
      );
      return;
    }

    const deliveryDate =
      estimatedDeliveryDate ||
      calculateEstimatedDeliveryDate();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
      console.warn(
        "[Google Customer Reviews] Invalid delivery date."
      );
      return;
    }

    const config: Record<string, unknown> = {
      merchant_id: 5317000737,
      order_id: String(orderId),
      email,
      delivery_country: deliveryCountry,
      estimated_delivery_date: deliveryDate,
      opt_in_style: optInStyle,
    };

    const validProducts = products?.filter(
      (product) => product.gtin?.trim()
    );

    if (validProducts?.length) {
      config.products = validProducts.map((product) => ({
        gtin: product.gtin!.trim(),
      }));
    }

    let cancelled = false;
    let loadStarted = false;

    const renderSurvey = () => {
      if (cancelled || renderedRef.current || loadStarted) {
        return;
      }

      // Do not display again for an order already handled
      // in this browser tab's current session.
      try {
        if (sessionStorage.getItem(storageKey) === "true") {
          return;
        }
      } catch {
        // Continue if sessionStorage is unavailable.
      }

      if (!window.gapi?.load) {
        console.warn(
          "[Google Customer Reviews] Google API is not ready."
        );
        return;
      }

      loadStarted = true;

      window.gapi.load("surveyoptin", () => {
        if (cancelled || renderedRef.current) return;

        try {
          const survey = window.gapi?.surveyoptin;

          if (!survey || typeof survey.render !== "function") {
            loadStarted = false;

            console.error(
              "[Google Customer Reviews] Survey module is unavailable."
            );
            return;
          }

          // Mark before rendering to prevent duplicate calls
          // during React rerenders or repeated callbacks.
          renderedRef.current = true;

          try {
            sessionStorage.setItem(storageKey, "true");
          } catch {
            // The ref still prevents duplicates in this mount.
          }

          console.log(
            "[Google Customer Reviews] Rendering opt-in for order:",
            String(orderId).slice(-6)
          );

          survey.render(config);
        } catch (error) {
          renderedRef.current = false;

          try {
            sessionStorage.removeItem(storageKey);
          } catch {
            // Ignore storage errors.
          }

          loadStarted = false;

          console.error(
            "[Google Customer Reviews] Survey render failed:",
            error
          );
        }
      });
    };

    window.renderOptIn = renderSurvey;

    const SCRIPT_ID =
      "google-customer-reviews-platform-script";

    let script = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null;

    const handleScriptLoad = () => {
      renderSurvey();
    };

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src =
        "https://apis.google.com/js/platform.js?onload=renderOptIn";
      script.async = true;
      script.defer = true;

      script.addEventListener("load", handleScriptLoad, {
        once: true,
      });

      script.addEventListener(
        "error",
        () => {
          console.error(
            "[Google Customer Reviews] Failed to load platform.js."
          );
        },
        { once: true }
      );

      document.body.appendChild(script);
    } else if (window.gapi?.load) {
      // Reuse the existing Google script.
      renderSurvey();
    } else {
      script.addEventListener("load", handleScriptLoad, {
        once: true,
      });
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", handleScriptLoad);
    };
  }, [
    orderId,
    customerEmail,
    deliveryCountry,
    estimatedDeliveryDate,
    optInStyle,
    products,
  ]);

  return null;
}