// Bulk order / contract manufacturing pages ke liye "Quick Facts" (buyers ko jo sabse pehle chahiye).
const FACTS = [
  { label: "Minimum order quantity", value: "250 to 500 litres, depending on the product" },
  { label: "Typical delivery time", value: "7 to 10 days" },
  { label: "Shelf life", value: "18 to 24 months" },
  { label: "Manufacturing options", value: "Private label and third-party (contract) manufacturing" },
  { label: "Supply", value: "India and international buyers" },
  { label: "Location", value: "Jaipur, Rajasthan, India" },
];

export default function B2BFacts() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
        Bulk &amp; Private Label Supply: Quick Facts
      </h2>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FACTS.map((fact) => (
          <div
            key={fact.label}
            className="rounded-lg border border-neutral-200 bg-white p-5 text-left shadow-sm"
          >
            <dt className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              {fact.label}
            </dt>
            <dd className="mt-1 text-base font-medium text-neutral-900">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-center text-sm text-neutral-600">
        MOQ and pricing vary by product. For a quote, send your requirement below or call{" "}
        <a className="underline" href="tel:+917597920642">+91 75979 20642</a> or email{" "}
        <a className="underline" href="mailto:director@aciagro.com">director@aciagro.com</a>.
      </p>
    </section>
  );
}
