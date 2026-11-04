// Organization structured data (JSON-LD) - layout.tsx se use hota hai.
//
// SOCIAL_PROFILES mein sirf ASLI profile URLs rakho (tracking params jaise ?utm_source ke bina).
const SOCIAL_PROFILES = [
  "https://www.instagram.com/aci.wellness/",
  "https://www.linkedin.com/company/aci-agro-solution/",
  "https://www.youtube.com/@ACIHerbalwellness",
  "https://www.facebook.com/profile.php?id=61584320260141",
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
      width: 512,
      height: 512,
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
