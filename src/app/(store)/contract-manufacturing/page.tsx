import type { Metadata } from "next";
import OrderForm from "../../../../components/BulkOrder/OrderForm/page";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title:
    "Herbal Juice Contract & Private Label Manufacturing | ACI Agro Solutions",
  description:
    "ACI Agro Solutions offers herbal juice contract manufacturing, private label manufacturing and bulk supply for Indian and international brands. Share your manufacturing requirements.",
  alternates: {
    canonical: "https://aciagro.com/contract-manufacturing",
  },
  openGraph: {
    title:
      "Herbal Juice Contract & Private Label Manufacturing | ACI Agro Solutions",
    description:
      "Your manufacturing partner for herbal juices, private label products and bulk supply. Connect with ACI Agro Solutions.",
    url: "https://aciagro.com/contract-manufacturing",
    siteName: "ACI Agro Solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Herbal Juice Contract & Private Label Manufacturing | ACI Agro Solutions",
    description:
      "Explore herbal juice contract manufacturing and private label opportunities with ACI Agro Solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const services = [
  {
    number: "01",
    title: "Contract Manufacturing",
    description:
      "Manufacturing support for businesses looking to source herbal juice products under their own business requirements.",
    points: [
      "Bulk production enquiries",
      "Product and packaging discussions",
      "Business-specific requirements",
    ],
  },
  {
    number: "02",
    title: "Private Label Manufacturing",
    description:
      "Explore opportunities to develop herbal juice products under your own brand with suitable packaging and labelling options.",
    points: [
      "Your brand identity",
      "Packaging options",
      "Product range discussions",
    ],
  },
  {
    number: "03",
    title: "Bulk Juice Supply",
    description:
      "Connect with our team for bulk herbal juice supply requirements for your distribution and business operations.",
    points: [
      "Bulk supply enquiries",
      "Product availability discussions",
      "Quantity-based requirements",
    ],
  },
  {
    number: "04",
    title: "Custom Product Requirements",
    description:
      "Have a specific herbal juice or product requirement? Share your idea and discuss possible manufacturing options with our team.",
    points: [
      "Custom product discussions",
      "Packaging preferences",
      "Business requirements",
    ],
  },
];

const products = [
  "Noni Juice",
  "Sea Buckthorn Juice",
  "Moringa Juice",
  "Herbal Vitality Juice",
  "Other Herbal Juice Products",
  "Custom Formulations",
];

const steps = [
  {
    number: "01",
    title: "Share Your Requirement",
    description:
      "Tell us about your product, quantity, packaging and business requirements.",
  },
  {
    number: "02",
    title: "Requirement Discussion",
    description:
      "Our team reviews your enquiry and discusses suitable product and packaging options.",
  },
  {
    number: "03",
    title: "Quotation & Planning",
    description:
      "Discuss the proposed order specifications, pricing and manufacturing requirements.",
  },
  {
    number: "04",
    title: "Move Forward",
    description:
      "Proceed with the mutually agreed product and order requirements.",
  },
];

export default function ContractManufacturingPage() {
  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              ACI AGRO SOLUTIONS · B2B MANUFACTURING
            </span>

            <h1 className={styles.heroTitle}>
              Your Partner in
              <span> Herbal Juice Manufacturing</span>
            </h1>

            <p className={styles.heroText}>
              Looking for a manufacturing partner for your herbal juice brand?
              Explore contract manufacturing, private label solutions and bulk
              supply opportunities with ACI Agro Solutions.
            </p>

            <div className={styles.heroActions}>
              <a href="#enquiry" className={styles.primaryButton}>
                Request a Manufacturing Quote
                <span>→</span>
              </a>

              <a href="#services" className={styles.secondaryButton}>
                Explore Our Services
              </a>
            </div>

            <div className={styles.heroTags}>
              <span>Contract Manufacturing</span>
              <span>Private Label</span>
              <span>Bulk Supply</span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualCircle}></div>
            <div className={styles.visualContent}>
              <span className={styles.visualSmall}>
                YOUR BRAND. YOUR REQUIREMENTS.
              </span>
              <strong>HERBAL JUICE</strong>
              <strong>MANUFACTURING</strong>
              <span className={styles.visualDivider}></span>
              <span className={styles.visualBottom}>
                INDIA & INTERNATIONAL ENQUIRIES
              </span>
            </div>
            <span className={styles.visualDecoration}>ACI</span>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className={styles.intro}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>ABOUT OUR SERVICES</span>
          <h2>
            Manufacturing Solutions for
            <span> Growing Brands</span>
          </h2>
          <p>
            Whether you are an established business, distributor, startup or
            international brand, connect with ACI Agro Solutions to discuss
            herbal juice manufacturing and bulk supply requirements.
          </p>
        </div>

        <div className={styles.audienceGrid}>
          <div>Indian Brands & Businesses</div>
          <div>International Buyers</div>
          <div>Distributors & Wholesalers</div>
          <div>New & Growing Brands</div>
        </div>
      </section>

      {/* SERVICES */}
      <section className={styles.services} id="services">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>WHAT WE OFFER</span>
          <h2>
            Our Manufacturing
            <span> Services</span>
          </h2>
          <p>
            Discuss your requirements and explore suitable manufacturing and
            supply options for your business.
          </p>
        </div>

        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <article className={styles.serviceCard} key={service.number}>
              <span className={styles.serviceNumber}>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>

              <ul>
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <a href="#enquiry">
                Discuss Your Requirement <span>→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* PRODUCT RANGE */}
      <section className={styles.products}>
        <div className={styles.productInner}>
          <div className={styles.productIntro}>
            <span className={styles.sectionLabel}>PRODUCT PORTFOLIO</span>
            <h2>
              Explore Our
              <span> Herbal Juice Range</span>
            </h2>
            <p>
              Connect with our team to discuss available products, packaging
              options and specific product requirements for your business.
            </p>
            <a href="#enquiry" className={styles.productButton}>
              Enquire About Products →
            </a>
          </div>

          <div className={styles.productList}>
            {products.map((product, index) => (
              <div className={styles.productItem} key={product}>
                <span>0{index + 1}</span>
                <strong>{product}</strong>
                <span className={styles.productArrow}>↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGING */}
      <section className={styles.packaging}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>PACKAGING OPTIONS</span>
          <h2>
            Packaging That Supports
            <span> Your Brand</span>
          </h2>
          <p>
            Discuss suitable packaging formats and sizes based on your product
            and business requirements.
          </p>
        </div>

        <div className={styles.packagingGrid}>
          <article className={styles.packagingCard}>
            <span className={styles.packagingIcon}>01</span>
            <h3>Bottle Sizes</h3>
            <p>
              Discuss available sizes such as 200 ml, 400 ml, 500 ml, 1 litre
              and custom requirements.
            </p>
          </article>

          <article className={styles.packagingCard}>
            <span className={styles.packagingIcon}>02</span>
            <h3>Packaging Types</h3>
            <p>
              Explore PET bottles, glass bottles and other suitable packaging
              options.
            </p>
          </article>

          <article className={styles.packagingCard}>
            <span className={styles.packagingIcon}>03</span>
            <h3>Private Label</h3>
            <p>
              Discuss your brand name, product labelling and packaging
              requirements.
            </p>
          </article>
        </div>
      </section>

      {/* PROCESS */}
      <section className={styles.process}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>HOW IT WORKS</span>
          <h2>
            From Enquiry to
            <span> Order Planning</span>
          </h2>
        </div>

        <div className={styles.processGrid}>
          {steps.map((step) => (
            <article className={styles.processCard} key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* INDIA & INTERNATIONAL */}
      <section className={styles.global}>
        <div className={styles.globalContent}>
          <span className={styles.sectionLabel}>BUSINESS ENQUIRIES</span>
          <h2>
            Connecting with Brands
            <span> Across Markets</span>
          </h2>
          <p>
            ACI Agro Solutions welcomes manufacturing and bulk supply
            enquiries from businesses in India and international markets.
            Share your requirements to begin a business discussion with our
            team.
          </p>

          <div className={styles.marketTags}>
            <span>India</span>
            <span>International Markets</span>
            <span>B2B Partnerships</span>
          </div>

          <a href="#enquiry" className={styles.globalButton}>
            Start a Business Enquiry →
          </a>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section className={styles.enquiry} id="enquiry">
        <div className={styles.enquiryHeading}>
          <span className={styles.sectionLabel}>LET'S DISCUSS YOUR PROJECT</span>
          <h2>
            Request a
            <span> Manufacturing Quote</span>
          </h2>
          <p>
            Tell us about your business and product requirements. Our team will
            review your enquiry and get in touch.
          </p>
        </div>

        <OrderForm />
      </section>
    </main>
  );
}
