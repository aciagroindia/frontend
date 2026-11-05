import type { Metadata } from "next";
import OrderForm from "../../../../components/BulkOrder/OrderForm/page";
import B2BFacts from "../../../../components/B2BFacts/B2BFacts";
import Certificates from "../../../../components/Certificates/Certificate";
import styles from "./page.module.css";
import { toJsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/utils/jsonLd";


export const metadata: Metadata = {
  title: "Private Label Herbal Juice Manufacturer",
  description:
    "Private label and contract manufacturing of herbal and Ayurvedic juices for brands in India and abroad. Request a quote for bulk supply from ACI Agro Solution.",
  alternates: {
    canonical: "https://aciagro.com/contract-manufacturing",
  },
  openGraph: {
    title:
      "Private Label Herbal Juice Manufacturer | ACI Agro Solution",
    description:
      "Private label and contract manufacturing of herbal and Ayurvedic juices for brands in India and abroad. Request a quote for bulk supply from ACI Agro Solution.",
    url: "https://aciagro.com/contract-manufacturing",
    siteName: "ACI Agro Solution",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ACI Agro Solution - Ayurvedic and Herbal Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Herbal Juice Contract & Private Label Manufacturing | ACI Agro Solution",
    description:
      "Explore herbal juice contract manufacturing and private label opportunities with ACI Agro Solution.",
    images: ["/og-image.png"],
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
      "We help businesses source herbal juice products for their own brands and needs.",
    points: [
      "Bulk production enquiries",
      "Product and packaging discussions",
      "Plans for your business",
    ],
  },
  {
    number: "02",
    title: "Private Label Manufacturing",
    description:
      "Create herbal juice products under your own brand with packaging and labelling options that fit your needs.",
    points: [
      "Your brand identity",
      "Packaging options",
      "Product range options",
    ],
  },
  {
    number: "03",
    title: "Bulk Juice Supply",
    description:
      "Contact our team for bulk herbal juice supply for your business or distribution needs.",
    points: [
      "Bulk supply enquiries",
      "Check product availability",
      "Order quantity options",
    ],
  },
  {
    number: "04",
    title: "Custom Product Requirements",
    description:
      "Need a specific herbal juice product? Share your idea with our team and discuss available production options.",
    points: [
      "Custom product ideas",
      "Packaging preferences",
      "Your business needs",
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
      "Tell us what product you need, the quantity, and your packaging needs.",
  },
  {
    number: "02",
    title: "Requirement Discussion",
    description:
      "Our team reviews your enquiry and helps you choose the right product and packaging options.",
  },
  {
    number: "03",
    title: "Quotation & Planning",
    description:
      "We discuss the order details, pricing and production needs with you.",
  },
  {
    number: "04",
    title: "Move Forward",
    description:
      "Move ahead with the agreed product details and order plan.",
  },
];

export default function ContractManufacturingPage() {
  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd([
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Contract Manufacturing", path: "/contract-manufacturing" },
            ]),
            serviceJsonLd({
              name: "Herbal Juice Contract & Private Label Manufacturing",
              serviceType: "Contract manufacturing and private label manufacturing of herbal juices",
              description: "Contract manufacturing, private label and bulk supply of herbal and Ayurvedic juices for brands, distributors and wholesalers in India and abroad.",
              path: "/contract-manufacturing",
            }),
          ]),
        }}
      />
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              ACI AGRO SOLUTION · B2B MANUFACTURING
            </span>

            <h1 className={styles.heroTitle}>
              Your Partner in
              <span> Herbal Juice Manufacturing</span>
            </h1>

            <p className={styles.heroText}>
              Looking for a manufacturing partner for your herbal juice brand?
              Explore contract manufacturing, private label solutions and bulk
              supply with ACI Agro Solution.
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
            Whether you run an established business, a startup or a distribution
            company, talk to ACI Agro Solution about herbal juice manufacturing
            and bulk supply.
          </p>
        </div>

        <div className={styles.audienceGrid}>
          <div>Indian Brands & Businesses</div>
          <div>International Buyers</div>
          <div>Distributors & Wholesalers</div>
          <div>New & Growing Brands</div>
        </div>
      </section>

      <B2BFacts />

      {/* SERVICES */}
      <section className={styles.services} id="services">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>WHAT WE OFFER</span>
          <h2>
            Our Manufacturing
            <span> Services</span>
          </h2>
          <p>
            Tell us what your business needs. We will help you explore the right
            manufacturing and supply options.
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
              Contact our team to learn about available products, packaging
              options and product choices for your business.
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
            Explore packaging types and sizes that fit your product and business needs.
          </p>
        </div>

        <div className={styles.packagingGrid}>
          <article className={styles.packagingCard}>
            <span className={styles.packagingIcon}>01</span>
            <h3>Bottle Sizes</h3>
            <p>
              Available sizes include 200 ml, 400 ml, 500 ml and 1 litre.
              You can also ask about custom sizes.
            </p>
          </article>

          <article className={styles.packagingCard}>
            <span className={styles.packagingIcon}>02</span>
            <h3>Packaging Types</h3>
            <p>
              Choose from PET bottles, glass bottles and other packaging options.
            </p>
          </article>

          <article className={styles.packagingCard}>
            <span className={styles.packagingIcon}>03</span>
            <h3>Private Label</h3>
            <p>
              Share your brand name and discuss product labels and packaging.
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
            ACI Agro Solution welcomes contract manufacturing and bulk supply
            enquiries from businesses in India and around the world. Share your
            needs with our team to start a discussion.
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

      <Certificates />

      {/* ENQUIRY FORM */}
      <section className={styles.enquiry} id="enquiry">
        <div className={styles.enquiryHeading}>
          <span className={styles.sectionLabel}>LET'S DISCUSS YOUR PROJECT</span>
          <h2>
            Request a
            <span> Manufacturing Quote</span>
          </h2>
          <p>
            Tell us about your business and the products you need. Our team will
            review your enquiry and contact you.
          </p>
        </div>

        <OrderForm />
      </section>
    </main>
  );
}
