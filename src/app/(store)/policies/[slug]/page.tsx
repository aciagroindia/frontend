"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import styles from "./Policy.module.css";
import axiosInstance from "@/utils/axiosInstance";

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

export default function PolicyDetailPage({
  params
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const slug = resolvedParams.slug;

  const [policy, setPolicy] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await axiosInstance.get(`/policies/${slug}`);
        if (res.data.success && res.data.data) {
          setPolicy(res.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error loading policy:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPolicy();
    }
  }, [slug]);

  const formattedDate = policy?.updatedAt
    ? new Date(policy.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "Recently Updated";

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* BREADCRUMB */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>·</span>
          <span>Policies</span>
          <span>·</span>
          <span>{policy?.title || "Policy"}</span>
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
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
              <p>Loading policy details...</p>
            </div>
          ) : error || !policy ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <h2 style={{ color: "#1e293b", marginBottom: "10px" }}>Policy Not Found</h2>
              <p style={{ color: "#64748b", marginBottom: "20px" }}>The requested policy could not be found.</p>
              <Link href="/" className={styles.contactBtn}>Back to Home</Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className={styles.header}>
                <span className={styles.badge}>Official Policy</span>
                <h1 className={styles.title}>{policy.title}</h1>
                <p className={styles.updatedDate}>Effective Date / Last Updated: {formattedDate}</p>
              </div>

              {/* Formatted Content */}
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: policy.content }}
              />

              {/* Help Box */}
              <div className={styles.helpBox}>
                <h3>Questions or Concerns?</h3>
                <p>If you have any questions regarding this policy or our products, our support team is happy to assist.</p>
                <Link href="/about" className={styles.contactBtn}>
                  Contact Support
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
