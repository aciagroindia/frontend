// SEO title helpers.
//
// layout.tsx title template:
// "%s | ACI Agro Solution"

const BRAND = "ACI Agro Solution";
const TEMPLATE_SUFFIX = ` | ${BRAND}`;
const MAX_TITLE = 60;
const BASE_BUDGET = MAX_TITLE - TEMPLATE_SUFFIX.length;

const BRAND_TAIL = /\s*[|\-–—:]\s*ACI\s*Agro\s*Solutions?\s*$/i;

function cleanBase(text) {
  let t = String(text || "").replace(/\s+/g, " ").trim();
  let prev;

  do {
    prev = t;
    t = t.replace(BRAND_TAIL, "").trim();
  } while (t !== prev);

  return t.replace(/[\s|\-–—:,&]+$/, "");
}

function truncateAtWord(text, max) {
  if (text.length <= max) return text;

  let cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");

  if (lastSpace > max * 0.6) {
    cut = cut.slice(0, lastSpace);
  }

  return cut.replace(/[\s|\-–—:,&]+$/, "");
}

export function fitProductTitle(name) {
  const base = cleanBase(name) || "Ayurvedic Product";
  const parts = base
    .split(/\s+[-–—|]\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

  let result = parts[0] || base;

  if (result.length > BASE_BUDGET) {
    result = truncateAtWord(result, BASE_BUDGET);
  } else {
    for (let i = 1; i < parts.length; i++) {
      const candidate = `${result} - ${parts[i]}`;

      if (candidate.length > BASE_BUDGET) break;

      result = candidate;
    }
  }

  const withBuy = `${result} - Buy Online`;

  return withBuy.length <= BASE_BUDGET ? withBuy : result;
}

export function fitFlexibleTitle(text) {
  const base = cleanBase(text) || BRAND;

  if (base.length <= BASE_BUDGET) return base;

  return {
    absolute: truncateAtWord(base, MAX_TITLE),
  };
}

export function titleToString(title) {
  if (typeof title === "string") {
    return `${title}${TEMPLATE_SUFFIX}`;
  }

  return title.absolute;
}

// Collection / category ke liye: admin mein category ke naam aksar bahut lambe aur keyword-stuffed hote hain
// (jaise "Herbal Juice, Nutraceuticals & Nutricosmetics, Health Supplements").
// Title ke liye pehla main phrase leta hai, jagah ho toh agla bhi, phir "- Buy Online" (B2C intent).
// Page ka H1 / content admin ke naam par hi rehta hai, sirf <title> chhota hota hai.
export function fitCategoryTitle(name) {
  const base = cleanBase(name) || "Herbal Products";
  const parts = base.split(/\s*[,/|]\s*|\s+[-–—]\s+/).map((p) => p.trim()).filter(Boolean);

  let result = parts[0] || base;
  if (result.length > BASE_BUDGET) {
    result = truncateAtWord(result, BASE_BUDGET);
  } else {
    for (let i = 1; i < parts.length; i++) {
      const candidate = `${result}, ${parts[i]}`;
      if (candidate.length > BASE_BUDGET) break;
      result = candidate;
    }
  }

  const withBuy = `${result} - Buy Online`;
  return withBuy.length <= BASE_BUDGET ? withBuy : result;
}
