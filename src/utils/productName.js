// Product ke naam jo admin mein bhare hain unme aksar brand ("Aci Agro Solution", typo "Sloution" ke saath),
// "Ayurvedic Herbal Medicine" aur shuru mein bullet (•) hote hain. Yeh helpers sirf DISPLAY ke liye safai karte hain.
// DB mein naam nahi badalta (cart/orders waise hi rehte hain).

const TRAILING_JUNK = [
  /\s*[-–—|:]?\s*ayurvedic herbal medicine\s*$/i,
  /\s*[-–—|:]?\s*aci\s*agro\s*s\w*\s*$/i, // "Aci Agro Solution", "Aci Agro Solutions", "Aci Agro Sloution"
];

export function cleanProductName(name) {
  const original = String(name || "").replace(/\s+/g, " ").trim();
  let t = original.replace(/^[•·\-–—\s]+/, "");
  let prev;
  do {
    prev = t;
    for (const re of TRAILING_JUNK) t = t.replace(re, "").trim();
  } while (t !== prev);
  t = t.replace(/[\s|\-–—:,&]+$/, "");
  return t || original;
}

// Chhota naam (image alt, links): pehla hissa, size/brackets ke bina
export function shortProductName(name) {
  return cleanProductName(name)
    .replace(/\(.*?\)/g, "")
    .split(/\s+[-–—|]\s+/)[0]
    .replace(/\s+/g, " ")
    .trim();
}
