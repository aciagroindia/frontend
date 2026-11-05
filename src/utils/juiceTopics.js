// Keyword landing pages: /juices/<slug>
// Har topic ek search keyword ko target karta hai (jaise "noni juice", "detox juice").
// Products API se aate hain, sirf wahi dikhte hain jinka naam `test` se match kare (naya product add hone par khud aa jata hai).
//
// NOTE: `html` copy maine neutral rakhi hai (koi health claim nahi). Isse apne hisaab se edit kar sakte ho.

const isJuice = (name) => /juice/i.test(name) && !/vinegar|drops?\b|protein/i.test(name);

const TOPIC_LINKS =
  '<a href="/juices/herbal-juices">herbal juices</a>, ' +
  '<a href="/juices/aloe-vera-juice">aloe vera juice</a>, ' +
  '<a href="/juices/detox-juice">detox juice</a>, ' +
  '<a href="/juices/noni-juice">noni juice</a> and ' +
  '<a href="/juices/moringa-juice">moringa juice</a>';

const BUSINESS_LINE =
  '<p>Business buyer? See our <a href="/bulk-order">bulk herbal juice supply</a> and ' +
  '<a href="/contract-manufacturing">private label and contract manufacturing</a> options for India and international orders.</p>';

const CONSULT_LINE =
  "<p><em>Always consult a healthcare professional before adding any supplement to your routine.</em></p>";

export const JUICE_TOPICS = [
  {
    slug: "herbal-juices",
    h1: "Herbal Juices",
    seoTitle: "Herbal Juices - Buy Online in India",
    metaDescription:
      "Buy herbal and Ayurvedic juices online in India: aloe vera, noni, amla, wheatgrass, moringa and more from ACI Agro Solution. Bulk and private label available.",
    test: (name) => isJuice(name),
    html:
      "<p>Explore the full range of herbal and Ayurvedic juices from ACI Agro Solution, from aloe vera blends to single-ingredient juices such as noni, amla, wheatgrass and moringa. Order online anywhere in India.</p>" +
      `<p>Looking for something specific? Browse ${TOPIC_LINKS}.</p>` +
      BUSINESS_LINE +
      CONSULT_LINE,
  },
  {
    slug: "detox-juice",
    h1: "Detox Juice",
    seoTitle: "Detox Juice - Buy Online in India",
    metaDescription:
      "Shop herbal detox juice online in India. Aloe vera, wheatgrass, giloy, triphala and chlorophyll juices from ACI Agro Solution. Bulk orders welcome.",
    test: (name) => isJuice(name) && /detox|cleans|chlorophyll/i.test(name),
    html:
      "<p>Our detox juice range brings together herbal blends such as aloe vera, wheatgrass, giloy, triphala and chlorophyll, made for people who like to include herbal drinks in their daily routine.</p>" +
      `<p>See also ${TOPIC_LINKS}.</p>` +
      BUSINESS_LINE +
      CONSULT_LINE,
  },
  {
    slug: "aloe-vera-juice",
    h1: "Aloe Vera Juice",
    seoTitle: "Aloe Vera Juice - Buy Online in India",
    metaDescription:
      "Buy aloe vera juice online in India, including aloe vera fiber juice with pulp and ready-to-drink flavours from ACI Agro Solution. Bulk supply available.",
    test: (name) => isJuice(name) && /aloe/i.test(name),
    html:
      "<p>Choose from aloe vera juice in many forms: plain aloe vera fiber juice with pulp, ready-to-drink fruit flavours such as mango, orange and pineapple, and herbal blends with amla, tulsi, ashwagandha and more.</p>" +
      `<p>See also ${TOPIC_LINKS}.</p>` +
      BUSINESS_LINE +
      CONSULT_LINE,
  },
  {
    slug: "noni-juice",
    h1: "Noni Juice",
    seoTitle: "Noni Juice - Buy Online in India",
    metaDescription:
      "Buy noni juice online in India. Pure Morinda citrifolia juice and noni blends from ACI Agro Solution. Bulk supply and private label available.",
    test: (name) => isJuice(name) && /noni/i.test(name),
    html:
      "<p>Noni (Morinda citrifolia) is a tropical fruit that features in traditional wellness routines. Explore our noni juice and noni blends, available to order online in India.</p>" +
      `<p>See also ${TOPIC_LINKS}.</p>` +
      BUSINESS_LINE +
      CONSULT_LINE,
  },
  {
    slug: "moringa-juice",
    h1: "Moringa Juice",
    seoTitle: "Moringa Juice - Buy Online in India",
    metaDescription:
      "Buy moringa juice online in India. Moringa herbal juices and blends from ACI Agro Solution. Bulk supply and private label available.",
    test: (name) => isJuice(name) && /moringa/i.test(name),
    html:
      "<p>Moringa is a leafy plant widely used in traditional Indian wellness routines. Explore our moringa juice and moringa blends, available to order online in India.</p>" +
      `<p>See also ${TOPIC_LINKS}.</p>` +
      BUSINESS_LINE +
      CONSULT_LINE,
  },
];

export function getJuiceTopic(slug) {
  return JUICE_TOPICS.find((t) => t.slug === slug) || null;
}

// ---------- Internal linking helpers (blog -> products/hubs, product -> hubs) ----------

// Article ke title mein inme se koi ingredient ho toh us ingredient ke juice products dikhaye jaate hain
const INGREDIENT_KEYWORDS = [
  "aloe vera", "aloevera", "noni", "moringa", "sea buckthorn", "amla", "giloy", "wheatgrass",
  "triphala", "shatavari", "jamun", "karela", "tulsi", "kokum", "ashwagandha", "neem",
  "brahmi", "stevia", "ginger", "lemongrass", "punarnava", "chlorophyll", "pomegranate",
];

// Article ke title se kaunse /juices/... pages relevant hain
const ARTICLE_TOPIC_RULES = {
  "aloe-vera-juice": /aloe/i,
  "noni-juice": /noni/i,
  "moringa-juice": /moringa/i,
  "detox-juice": /detox|cleans/i,
  "herbal-juices": /herbal juice|ayurvedic juice|\bjuices\b/i,
};

export function topicsForArticleText(text) {
  const t = String(text || "");
  return JUICE_TOPICS.filter((topic) => ARTICLE_TOPIC_RULES[topic.slug]?.test(t)).slice(0, 3);
}

// Product ke naam ke hisaab se relevant /juices/... pages
export function topicsForProductName(name) {
  const n = String(name || "");
  return JUICE_TOPICS.filter((topic) => topic.test(n));
}

// Article ke title ke ingredient se milte juice products (max `limit`)
export function matchProductsForArticle(title, products, limit = 4) {
  const t = String(title || "").toLowerCase();
  const hit = INGREDIENT_KEYWORDS.filter((k) => t.includes(k));
  if (hit.length === 0) return [];
  return products
    .filter((p) => {
      const name = String(p.name || "").toLowerCase();
      return isJuice(name) && hit.some((k) => name.includes(k.replace("aloevera", "aloe")));
    })
    .slice(0, limit);
}

// Product ka chhota display naam (pehla hissa, " - " se pehle)
export function shortProductName(name) {
  return String(name || "")
    .replace(/\(.*?\)/g, "") // (500ml, Pack of 1) jaise hisse hatao
    .replace(/aci\s*agro\s*s\w*/gi, "") // brand (typo ke saath) hatao
    .split(/\s+[-–—|]\s+/)[0]
    .replace(/\s+/g, " ")
    .trim();
}
