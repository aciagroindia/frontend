"use client";

import { useEffect } from "react";
import { trackEvent } from "@/utils/analytics";

// Site ke kisi bhi call / email / WhatsApp link par click hone par GA4 event bhejta hai
// (alag-alag components mein code badalne ki zaroorat nahi).
export default function ContactClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.("a");
      const href = link?.getAttribute("href") || "";
      if (!href) return;

      if (href.startsWith("tel:")) {
        trackEvent("click_call", { link_url: href, page_path: window.location.pathname });
      } else if (href.startsWith("mailto:")) {
        trackEvent("click_email", { link_url: href, page_path: window.location.pathname });
      } else if (/wa\.me|api\.whatsapp\.com|web\.whatsapp\.com/i.test(href)) {
        trackEvent("click_whatsapp", { page_path: window.location.pathname });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
