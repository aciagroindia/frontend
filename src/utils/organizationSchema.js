// Organization structured data (JSON-LD) - layout.tsx se use hota hai.
//
// TODO (zaroori): SOCIAL_PROFILES mein apne ASLI profile URLs daalo.
// Footer mein abhi sirf facebook.com / instagram.com jaise generic links hain, wo yahan mat daalna.
// Example: "https://www.instagram.com/<your_handle>/"
const SOCIAL_PROFILES = [
  // "https://www.facebook.com/<page>",
  // "https://www.instagram.com/<handle>/",
  // "https://www.youtube.com/@<channel>",
  // "https://www.linkedin.com/company/<company>",
];

// Optional: asli business address ho toh daalo (Google ko local info milti hai). null rakhoge toh skip ho jayega.
const ADDRESS = null;
// Example:
// const ADDRESS = {
//   streetAddress: "…",
//   addressLocality: "Jaipur",
//   addressRegion: "Rajasthan",
//   postalCode: "302001",
//   addressCountry: "IN",
// };

const SITE_URL = "https://aciagro.com";

export function buildOrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "ACI Agro Solutions",
    legalName: "ACI Agro Solutions",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/assets/Aci%20logo.png`,
      width: 3264,
      height: 3264,
    },
    image: `${SITE_URL}/og-image.png`,
    description:
      "Shop authentic Ayurvedic and herbal wellness products made with traditional wisdom by ACI Agro Solutions.",
    email: "director@aciagro.com",
    telephone: "+91-75979-20642",
    areaServed: "IN",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+91-75979-20642",
        email: "director@aciagro.com",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };

  if (SOCIAL_PROFILES.length > 0) schema.sameAs = SOCIAL_PROFILES;
  if (ADDRESS) schema.address = { "@type": "PostalAddress", ...ADDRESS };

  return schema;
}
