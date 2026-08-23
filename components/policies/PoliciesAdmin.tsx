"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  FileText, 
  Truck, 
  RotateCcw, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Eye, 
  Edit3, 
  ExternalLink, 
  Save, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import styles from "./PoliciesAdmin.module.css";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";

interface PolicyItem {
  slug: string;
  title: string;
  content: string;
  updatedAt?: string;
  updatedBy?: string;
}

const POLICY_TABS = [
  { slug: "privacy-policy", label: "Privacy Policy", icon: ShieldCheck },
  { slug: "cancellation-policy", label: "Cancellation Policy", icon: RotateCcw },
  { slug: "shipping-policy", label: "Shipping Policy", icon: Truck },
  { slug: "terms-of-service", label: "Terms of Service", icon: FileText },
];

export default function PoliciesAdmin() {
  const [activeSlug, setActiveSlug] = useState("privacy-policy");
  const [policies, setPolicies] = useState<Record<string, PolicyItem>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Active editor state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  const contentRef = useRef<HTMLDivElement>(null);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/policies");
      if (res.data.success && Array.isArray(res.data.data)) {
        const mapped: Record<string, PolicyItem> = {};
        res.data.data.forEach((p: PolicyItem) => {
          mapped[p.slug] = p;
        });
        setPolicies(mapped);

        if (mapped[activeSlug]) {
          setTitle(mapped[activeSlug].title || "");
          setContent(mapped[activeSlug].content || "");
        }
      }
    } catch (err: any) {
      console.error("Error fetching policies:", err);
      toast.error(err.response?.data?.message || "Failed to load policies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // When tab changes, load corresponding policy
  const handleTabChange = (slug: string) => {
    setActiveSlug(slug);
    setActiveTab("editor");
    if (policies[slug]) {
      setTitle(policies[slug].title || "");
      setContent(policies[slug].content || "");
    }
  };

  // Sync content with contentEditable DOM element
  useEffect(() => {
    if (activeTab === "editor" && contentRef.current) {
      if (contentRef.current.innerHTML !== content) {
        contentRef.current.innerHTML = content;
      }
    }
  }, [activeTab, content, activeSlug]);

  const formatDoc = (cmd: string, val?: string) => {
    if (activeTab !== "editor") return;
    document.execCommand(cmd, false, val);
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Policy title is required.");
      return;
    }
    if (!content.trim()) {
      toast.error("Policy content is required.");
      return;
    }

    try {
      setIsSaving(true);
      const res = await axiosInstance.put(`/policies/${activeSlug}`, {
        title: title.trim(),
        content: content
      });

      if (res.data.success) {
        toast.success(`${title} saved successfully!`);
        setPolicies(prev => ({
          ...prev,
          [activeSlug]: res.data.data
        }));
      }
    } catch (err: any) {
      console.error("Error updating policy:", err);
      toast.error(err.response?.data?.message || "Failed to save policy.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentPolicy = policies[activeSlug];
  const lastUpdated = currentPolicy?.updatedAt 
    ? new Date(currentPolicy.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "Recently";

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Store Policies Management</h1>
          <p className={styles.subtitle}>
            Edit, format, and publish your live legal, refund, and shipping policies.
          </p>
        </div>

        <Link
          href={`/policies/${activeSlug}`}
          target="_blank"
          className={styles.viewLiveBtn}
        >
          <ExternalLink size={16} /> View Live Policy
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        {POLICY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSlug === tab.slug;
          return (
            <button
              key={tab.slug}
              type="button"
              className={`${styles.tabBtn} ${isActive ? styles.activeTab : ""}`}
              onClick={() => handleTabChange(tab.slug)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {isActive && <div className={styles.activeIndicator} />}
            </button>
          );
        })}
      </div>

      {/* Main Editor Card */}
      <div className={styles.editorCard}>
        {loading ? (
          <div className={styles.loadingState}>Loading policy content...</div>
        ) : (
          <form onSubmit={handleSave} className={styles.policyForm}>
            {/* Meta Row */}
            <div className={styles.metaRow}>
              <div className={styles.metaInfo}>
                <span className={styles.badge}><CheckCircle2 size={13} /> Live on Store</span>
                <span className={styles.updatedText}><Clock size={13} /> Last updated: {lastUpdated}</span>
              </div>
              <span className={styles.slugTag}>/policies/{activeSlug}</span>
            </div>

            {/* Title */}
            <div className={styles.formGroup}>
              <label htmlFor="policy-title">Policy Title</label>
              <input
                type="text"
                id="policy-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Policy Title"
                className={styles.titleInput}
                required
              />
            </div>

            {/* Content Editor */}
            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label>Policy Content</label>
                <span className={styles.hint}>
                  💡 Format bold lines as headings, write bullet terms, and clauses cleanly.
                </span>
              </div>

              <div className={styles.editorWrapper}>
                {/* Toolbar */}
                <div className={styles.toolbar}>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => formatDoc("bold")}
                    title="Bold"
                  >
                    <Bold size={15} /> <span>Bold</span>
                  </button>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => formatDoc("italic")}
                    title="Italic"
                  >
                    <Italic size={15} /> <span>Italic</span>
                  </button>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => formatDoc("insertUnorderedList")}
                    title="Bullet List"
                  >
                    <List size={15} /> <span>Bullets</span>
                  </button>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => formatDoc("insertOrderedList")}
                    title="Numbered List"
                  >
                    <ListOrdered size={15} /> <span>Numbers</span>
                  </button>

                  {/* Tabs */}
                  <div className={styles.viewToggle}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${activeTab === "editor" ? styles.activeToggle : ""}`}
                      onClick={() => setActiveTab("editor")}
                    >
                      <Edit3 size={14} /> Write
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${activeTab === "preview" ? styles.activeToggle : ""}`}
                      onClick={() => setActiveTab("preview")}
                    >
                      <Eye size={14} /> Preview
                    </button>
                  </div>
                </div>

                {/* Editable / Preview Area */}
                {activeTab === "editor" ? (
                  <div
                    ref={contentRef}
                    className={styles.contentArea}
                    contentEditable
                    onInput={handleInput}
                    data-placeholder="Write policy terms, conditions, refund timeline, and guidelines here..."
                  />
                ) : (
                  <div
                    className={styles.previewArea}
                    dangerouslySetInnerHTML={{ __html: content || "<p>No policy content to preview.</p>" }}
                  />
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className={styles.bottomBar}>
              <button
                type="submit"
                disabled={isSaving}
                className={styles.saveBtn}
              >
                <Save size={16} />
                {isSaving ? "Saving Policy..." : "Save & Publish Policy"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
