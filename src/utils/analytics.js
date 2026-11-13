// GA4 event bhejne ka chhota helper. gtag layout.tsx mein load hota hai (G-XENSPV6GWS).
// GA4 mein in events ko "Key event" (conversion) mark karna: generate_lead, click_call, click_whatsapp, click_email.
export function trackEvent(name, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch (e) {
    // analytics kabhi site ko tod nahi sakta
  }
}
