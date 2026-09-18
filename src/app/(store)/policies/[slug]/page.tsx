import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./Policy.module.css";
import axiosInstance from "@/utils/axiosInstance";

const SITE_URL = "https://aciagro.com";

interface PolicyData {
  slug: string;
  title: string;
  content: string;
  updatedAt?: string;
}

const ALL_POLICIES = [
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "cancellation-policy", label: "Cancellation Policy" },
  { slug: "shipping-policy", label: "Shipping Policy" },
  { slug: "terms-of-service", label: "Terms of Service" },
];

async function getPolicy(slug: string): Promise<PolicyData | null> {
  const isStandard = ALL_POLICIES.some((p) => p.slug === slug);
  if (!isStandard) {
    return null;
  }

  try {
    const res = await axiosInstance.get(`/policies/${slug}`);
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = await getPolicy(slug);

  if (!policy) {
    return {};
  }

  const title = `${policy.title} | ACI Agro Solutions`;
  const canonicalUrl = `${SITE_URL}/policies/${policy.slug}`;

  return {
    title,
    description: `Official ${policy.title} for ACI Agro Solutions. Read our policies, terms, and guidelines.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: `Official ${policy.title} for ACI Agro Solutions.`,
      url: canonicalUrl,
      siteName: "ACI Agro Solutions",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description: `Official ${policy.title} for ACI Agro Solutions.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PolicyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = await getPolicy(slug);

  if (!policy) {
    return notFound();
  }

  const formattedDate = policy.updatedAt
    ? new Date(policy.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently Updated";

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>·</span>
          <span>Policies</span>
          <span>·</span>
          <span aria-current="page">{policy.title}</span>
        </nav>

        {/* POLICY QUICK SWITCH TABS */}
        <div className={styles.policyNav}>
          {ALL_POLICIES.map((p) => {
            const isActive = p.slug === slug;
            return (
              <Link
                key={p.slug}
                href={`/policies/${p.slug}`}
                className={`${styles.policyNavLink} ${isActive ? styles.policyNavLinkActive : ""}`}
              >
                {p.label}
              </Link>
            );
          })}
        </div>

        {/* MAIN POLICY CONTENT CARD */}
        <div className={styles.policyCard}>
          {/* Header */}
          <div className={styles.header}>
            <span className={styles.badge}>Official Policy</span>
            <h1 className={styles.title}>{policy.title}</h1>
            <p className={styles.updatedDate}>
              Effective Date / Last Updated: {formattedDate}
            </p>
          </div>

          {/* Formatted Content */}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />

          {/* Help Box */}
          <div className={styles.helpBox}>
            <h3>Questions or Concerns?</h3>
            <p>
              If you have any questions regarding this policy or our products, our
              support team is happy to assist.
            </p>
            <Link href="/about" className={styles.contactBtn}>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
