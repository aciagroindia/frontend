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
      "Buy herbal and Ayurvedic juices online in India: aloe vera, noni, amla, wheatgrass, moringa and more from ACI Agro Solutions. Bulk and private label available.",
    test: (name) => isJuice(name),
    html:
      "<p>Explore the full range of herbal and Ayurvedic juices from ACI Agro Solutions, from aloe vera blends to single-ingredient juices such as noni, amla, wheatgrass and moringa. Order online anywhere in India.</p>" +
      `<p>Looking for something specific? Browse ${TOPIC_LINKS}.</p>` +
      BUSINESS_LINE +
      CONSULT_LINE,
  },
  {
    slug: "detox-juice",
    h1: "Detox Juice",
    seoTitle: "Detox Juice - Buy Online in India",
    metaDescription:
      "Shop herbal detox juice online in India. Aloe vera, wheatgrass, giloy, triphala and chlorophyll juices from ACI Agro Solutions. Bulk orders welcome.",
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
      "Buy aloe vera juice online in India, including aloe vera fiber juice with pulp and ready-to-drink flavours from ACI Agro Solutions. Bulk supply available.",
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
      "Buy noni juice online in India. Pure Morinda citrifolia juice and noni blends from ACI Agro Solutions. Bulk supply and private label available.",
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
      "Buy moringa juice online in India. Moringa herbal juices and blends from ACI Agro Solutions. Bulk supply and private label available.",
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
