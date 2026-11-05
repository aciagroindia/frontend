import Link from "next/link";

// Homepage ka main H1 + intro. Pehle homepage ka H1 "SHOP BY CATEGORY" tha (koi keyword nahi).
// Pehle customers (B2C), phir businesses (B2B). B2B pages ko keyword wale internal links bhi yahin se milte hain.
export default function HomeIntro() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
        Buy Authentic Herbal &amp; Ayurvedic Juices Online in India
      </h1>
      <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
        ACI Agro Solution makes Ayurvedic and herbal juices for everyday
        wellness. Order online for your home, or talk to us about bulk supply,
        private label and contract manufacturing for India and international
        markets.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="#shop-by-category"
          className="rounded-md bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          Shop Herbal Juices
        </a>
        <Link
          href="/bulk-order"
          className="rounded-md border border-neutral-900 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
        >
          Bulk Herbal Juice Supply
        </Link>
        <Link
          href="/contract-manufacturing"
          className="rounded-md border border-neutral-900 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
        >
          Private Label Manufacturing
        </Link>
      </div>
      <p className="mt-6 text-sm text-neutral-600">
        Popular:{" "}
        <Link href="/juices/herbal-juices" className="underline hover:text-neutral-900">Herbal Juices</Link>
        {" · "}
        <Link href="/juices/aloe-vera-juice" className="underline hover:text-neutral-900">Aloe Vera Juice</Link>
        {" · "}
        <Link href="/juices/detox-juice" className="underline hover:text-neutral-900">Detox Juice</Link>
        {" · "}
        <Link href="/juices/noni-juice" className="underline hover:text-neutral-900">Noni Juice</Link>
        {" · "}
        <Link href="/juices/moringa-juice" className="underline hover:text-neutral-900">Moringa Juice</Link>
      </p>
    </section>
  );
}
