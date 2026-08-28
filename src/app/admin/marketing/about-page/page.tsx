"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../../../../components/admin-layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import {
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Layers,
  BookOpen,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  UploadCloud,
  CheckCircle2,
  Info,
} from "lucide-react";
import ConfirmationModal from "../../../../../components/signUP/ConfirmationModal";
import styles from "./aboutAdmin.module.css";

interface CustomSection {
  id: string;
  title: string;
  tag?: string;
  content: string;
  imageUrl?: string;
  layout: "center" | "split-left" | "split-right" | "banner";
  bgType: "color" | "image";
  bgColor?: string;
  bgImage?: string;
  headingColor?: string;
  textColor?: string;
  order?: number;
  isActive: boolean;
}

interface AboutPageConfig {
  hero: {
    title: string;
    subtitle: string;
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    textColor?: string;
    isActive: boolean;
  };
  story: {
    title: string;
    paragraphs: string[];
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    headingColor?: string;
    textColor?: string;
    isActive: boolean;
  };
  philosophy: {
    title: string;
    description: string;
    imageUrl?: string;
    imagePosition?: "left" | "right";
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    headingColor?: string;
    textColor?: string;
    isActive: boolean;
  };
  ingredients: {
    title: string;
    description: string;
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    headingColor?: string;
    textColor?: string;
    isActive: boolean;
  };
  quality: {
    title: string;
    description: string;
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    headingColor?: string;
    textColor?: string;
    isActive: boolean;
  };
  metrics: {
    items: { value: string; label: string }[];
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    textColor?: string;
    isActive: boolean;
  };
  closing: {
    title: string;
    subtitle: string;
    bgType: "color" | "image";
    bgColor?: string;
    bgImage?: string;
    headingColor?: string;
    textColor?: string;
    isActive: boolean;
  };
  customSections: CustomSection[];
}

const DEFAULT_CONFIG: AboutPageConfig = {
  hero: {
    title: "Rooted in Ayurveda. Crafted for Modern Life.",
    subtitle:
      "We blend ancient Ayurvedic wisdom with modern science to create pure, effective, and sustainable wellness products.",
    bgType: "image",
    bgColor: "#14854e",
    bgImage: "/banner1.jpg",
    textColor: "#ffffff",
    isActive: true,
  },
  story: {
    title: "Our Story",
    paragraphs: [
      "Our journey began with a simple belief — true wellness comes from nature. Inspired by centuries-old Ayurvedic formulations, we set out to create products that are safe, transparent, and deeply rooted in tradition.",
      "Every product is thoughtfully crafted using ethically sourced herbs, carefully tested, and formulated to restore balance to your body and mind.",
    ],
    bgType: "color",
    bgColor: "#f3f9f6",
    bgImage: "",
    headingColor: "#14854e",
    textColor: "#374151",
    isActive: true,
  },
  philosophy: {
    title: "The Ayurvedic Philosophy",
    description:
      "Ayurveda teaches balance — balance of body, mind, and spirit. Our formulations are designed to support natural healing using time-tested herbs without harmful chemicals.",
    imageUrl: "/certifiedIcons/whychooseus.png",
    imagePosition: "left",
    bgType: "color",
    bgColor: "#fffdf8",
    bgImage: "",
    headingColor: "#111827",
    textColor: "#4b5563",
    isActive: true,
  },
  ingredients: {
    title: "Pure Ingredients. Ethical Sourcing.",
    description:
      "We work directly with trusted farmers to source organic herbs. No parabens. No sulfates. No synthetic toxins.",
    bgType: "color",
    bgColor: "#f3f9f6",
    bgImage: "",
    headingColor: "#111827",
    textColor: "#4b5563",
    isActive: true,
  },
  quality: {
    title: "Quality & Safety First",
    description:
      "Manufactured in GMP-certified facilities and tested for purity, potency, and safety before reaching your home.",
    bgType: "color",
    bgColor: "#fffdf8",
    bgImage: "",
    headingColor: "#111827",
    textColor: "#4b5563",
    isActive: true,
  },
  metrics: {
    items: [
      { value: "10,000+", label: "Happy Customers" },
      { value: "4.8★", label: "Average Rating" },
      { value: "100%", label: "Natural Ingredients" },
    ],
    bgType: "color",
    bgColor: "#14854e",
    bgImage: "",
    textColor: "#ffffff",
    isActive: true,
  },
  closing: {
    title: "Experience the Power of Nature 🌿",
    subtitle: "Join thousands who trust us for authentic Ayurvedic wellness.",
    bgType: "color",
    bgColor: "#f3f9f6",
    bgImage: "",
    headingColor: "#111827",
    textColor: "#4b5563",
    isActive: true,
  },
  customSections: [],
};

export default function AboutPageAdmin() {
  const [config, setConfig] = useState<AboutPageConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<string>("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // File uploads state
  const [heroBgFile, setHeroBgFile] = useState<File | null>(null);
  const [heroBgPreview, setHeroBgPreview] = useState<string>("/banner1.jpg");

  const [philosophyImgFile, setPhilosophyImgFile] = useState<File | null>(null);
  const [philosophyImgPreview, setPhilosophyImgPreview] = useState<string>(
    "/certifiedIcons/whychooseus.png"
  );

  const [customFiles, setCustomFiles] = useState<{ [key: string]: File }>({});
  const [customPreviews, setCustomPreviews] = useState<{ [key: string]: string }>({});

  const heroFileInputRef = useRef<HTMLInputElement | null>(null);
  const philosophyFileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/about-page");
      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        setConfig((prev) => ({
          ...prev,
          ...data,
          hero: { ...prev.hero, ...data.hero },
          story: { ...prev.story, ...data.story },
          philosophy: { ...prev.philosophy, ...data.philosophy },
          ingredients: { ...prev.ingredients, ...data.ingredients },
          quality: { ...prev.quality, ...data.quality },
          metrics: { ...prev.metrics, ...data.metrics },
          closing: { ...prev.closing, ...data.closing },
          customSections: data.customSections || [],
        }));
        if (data.hero?.bgImage) setHeroBgPreview(data.hero.bgImage);
        if (data.philosophy?.imageUrl) setPhilosophyImgPreview(data.philosophy.imageUrl);
      }
    } catch (error) {
      toast.error("Failed to load about page configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleHeroBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHeroBgFile(file);
      setHeroBgPreview(URL.createObjectURL(file));
      setConfig((prev) => ({
        ...prev,
        hero: { ...prev.hero, bgType: "image" },
      }));
    }
  };

  const handlePhilosophyImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhilosophyImgFile(file);
      setPhilosophyImgPreview(URL.createObjectURL(file));
    }
  };

  const handleCustomFileChange = (
    secId: string,
    type: "img" | "bg",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const key = `custom_${type}_${secId}`;
      setCustomFiles((prev) => ({ ...prev, [key]: file }));
      setCustomPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));

      if (type === "bg") {
        setConfig((prev) => ({
          ...prev,
          customSections: prev.customSections.map((s) =>
            s.id === secId ? { ...s, bgType: "image" } : s
          ),
        }));
      }
    }
  };

  const handleAddCustomSection = () => {
    const newId = "sec_" + Date.now();
    const newSection: CustomSection = {
      id: newId,
      title: "New Custom Section",
      tag: "HIGHLIGHT",
      content: "Write detailed content for this section here.",
      layout: "center",
      bgType: "color",
      bgColor: "#ffffff",
      headingColor: "#111827",
      textColor: "#4b5563",
      order: config.customSections.length,
      isActive: true,
    };
    setConfig((prev) => ({
      ...prev,
      customSections: [...prev.customSections, newSection],
    }));
    setActiveTab("custom");
    toast.success("New custom section created!");
  };

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleRemoveCustomSection = (id: string) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Custom Section",
      message: "Are you sure you want to delete this custom section? This action cannot be undone.",
      onConfirm: () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        setConfig((prev) => ({
          ...prev,
          customSections: prev.customSections.filter((s) => s.id !== id),
        }));
        toast.success("Custom section removed");
      },
    });
  };

  const handleCustomSectionChange = (
    id: string,
    field: keyof CustomSection,
    value: any
  ) => {
    setConfig((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const handleMetricChange = (
    index: number,
    field: "value" | "label",
    value: string
  ) => {
    const updated = [...config.metrics.items];
    updated[index] = { ...updated[index], [field]: value };
    setConfig((prev) => ({
      ...prev,
      metrics: { ...prev.metrics, items: updated },
    }));
  };

  const handleAddMetric = () => {
    setConfig((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        items: [...prev.metrics.items, { value: "100%", label: "Metric Label" }],
      },
    }));
  };

  const handleRemoveMetric = (index: number) => {
    if (config.metrics.items.length <= 1) {
      toast.error("Must have at least one metric");
      return;
    }
    setConfig((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        items: prev.metrics.items.filter((_, i) => i !== index),
      },
    }));
  };

  const handleResetDefaults = () => {
    setModalConfig({
      isOpen: true,
      title: "Reset About Page Configuration",
      message: "Reset About page configuration to default values? Any unsaved changes will be lost.",
      onConfirm: () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        setConfig(DEFAULT_CONFIG);
        setHeroBgFile(null);
        setHeroBgPreview("/banner1.jpg");
        setPhilosophyImgFile(null);
        setPhilosophyImgPreview("/certifiedIcons/whychooseus.png");
        setCustomFiles({});
        setCustomPreviews({});
        toast.success("Reset to defaults");
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = new FormData();

      payload.append("hero", JSON.stringify(config.hero));
      payload.append("story", JSON.stringify(config.story));
      payload.append("philosophy", JSON.stringify(config.philosophy));
      payload.append("ingredients", JSON.stringify(config.ingredients));
      payload.append("quality", JSON.stringify(config.quality));
      payload.append("metrics", JSON.stringify(config.metrics));
      payload.append("closing", JSON.stringify(config.closing));
      payload.append("customSections", JSON.stringify(config.customSections));

      if (heroBgFile) payload.append("hero_bg", heroBgFile);
      if (philosophyImgFile) payload.append("philosophy_image", philosophyImgFile);

      Object.keys(customFiles).forEach((key) => {
        payload.append(key, customFiles[key]);
      });

      const res = await axiosInstance.put("/about-page", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success("About page updated successfully!");
        setHeroBgFile(null);
        setPhilosophyImgFile(null);
        setCustomFiles({});
        if (res.data.data) {
          setConfig(res.data.data);
        }
      }
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: "hero", label: "Hero Banner", icon: Sparkles },
    { id: "story", label: "Our Story", icon: BookOpen },
    { id: "philosophy", label: "Philosophy", icon: Layers },
    { id: "ingredients", label: "Ingredients", icon: CheckCircle2 },
    { id: "quality", label: "Quality & Safety", icon: ShieldCheck },
    { id: "metrics", label: "Trust Metrics", icon: BarChart3 },
    { id: "closing", label: "Closing CTA", icon: MessageSquare },
    {
      id: "custom",
      label: `Custom Sections (${config.customSections.length})`,
      icon: Plus,
    },
  ];

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Top Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>About Page Manager</h1>
            <p className={styles.subtitle}>
              Customize text, background colors/images, text colors, and create custom sections for your store's About page.
            </p>
          </div>

          <div className={styles.headerActions}>
            <a
              href="/about"
              target="_blank"
              rel="noreferrer"
              className={styles.previewBtn}
            >
              <ExternalLink size={16} />
              View Store Page
            </a>

            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleResetDefaults}
              disabled={loading || saving}
            >
              <RotateCcw size={16} />
              Reset Defaults
            </button>

            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSubmit}
              disabled={loading || saving}
            >
              <Save size={18} />
              {saving ? "Saving Changes..." : "Save All Changes"}
            </button>
          </div>
        </div>

        <div className={styles.infoBanner}>
          <Info size={20} style={{ flexShrink: 0 }} />
          <span>
            <strong>Note:</strong> The <strong>About Media (Visual Gallery)</strong> and <strong>Certificates</strong> sections continue to be managed dynamically from their dedicated menus and will automatically appear in their designated places on the About page.
          </span>
        </div>

        {/* Section Navigation Tabs */}
        <div className={styles.tabsContainer}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabBtn} ${
                  activeTab === tab.id ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: HERO SECTION ================= */}
        {activeTab === "hero" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Sparkles size={20} color="#2e7d32" />
                Hero Banner
              </h2>
              <label className={styles.toggleWrapper}>
                <input
                  type="checkbox"
                  checked={config.hero.isActive}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, isActive: e.target.checked },
                    })
                  }
                />
                Section Active
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Hero Title / Headline</label>
              <input
                type="text"
                className={styles.input}
                value={config.hero.title}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    hero: { ...config.hero, title: e.target.value },
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Hero Subtitle / Description</label>
              <textarea
                className={styles.textarea}
                value={config.hero.subtitle}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    hero: { ...config.hero, subtitle: e.target.value },
                  })
                }
                rows={3}
              />
            </div>

            {/* Background Selector */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Background Style</label>
              <div className={styles.bgTypeToggle}>
                <button
                  type="button"
                  className={`${styles.bgTypeOption} ${
                    config.hero.bgType === "image" ? styles.bgTypeOptionActive : ""
                  }`}
                  onClick={() =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, bgType: "image" },
                    })
                  }
                >
                  Background Image
                </button>
                <button
                  type="button"
                  className={`${styles.bgTypeOption} ${
                    config.hero.bgType === "color" ? styles.bgTypeOptionActive : ""
                  }`}
                  onClick={() =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, bgType: "color" },
                    })
                  }
                >
                  Solid Color
                </button>
              </div>

              {config.hero.bgType === "image" ? (
                <div>
                  <div
                    className={styles.uploadContainer}
                    onClick={() => heroFileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={heroFileInputRef}
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleHeroBgChange}
                    />
                    <div className={styles.uploadIconWrapper}>
                      <UploadCloud size={22} />
                    </div>
                    <p className={styles.uploadText}>
                      {heroBgFile ? heroBgFile.name : "Click to upload Hero Background Image"}
                    </p>
                    <p className={styles.uploadHint}>JPG, PNG, WebP (1920x600 recommended)</p>
                  </div>
                  {heroBgPreview && (
                    <div className={styles.imagePreviewBox}>
                      <img src={heroBgPreview} alt="Hero background preview" className={styles.previewImg} />
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.hero.bgColor || "#14854e"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero: { ...config.hero, bgColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.hero.bgColor || "#14854e"}</span>
                </div>
              )}
            </div>

            {/* Text Color */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Text Color</label>
              <div className={styles.colorGroup}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={config.hero.textColor || "#ffffff"}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, textColor: e.target.value },
                    })
                  }
                />
                <span className={styles.colorHex}>{config.hero.textColor || "#ffffff"}</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: OUR STORY ================= */}
        {activeTab === "story" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <BookOpen size={20} color="#2e7d32" />
                Our Story Section
              </h2>
              <label className={styles.toggleWrapper}>
                <input
                  type="checkbox"
                  checked={config.story.isActive}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      story: { ...config.story, isActive: e.target.checked },
                    })
                  }
                />
                Section Active
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Section Heading</label>
              <input
                type="text"
                className={styles.input}
                value={config.story.title}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    story: { ...config.story, title: e.target.value },
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Story Paragraph 1</label>
              <textarea
                className={styles.textarea}
                value={config.story.paragraphs[0] || ""}
                onChange={(e) => {
                  const updated = [...config.story.paragraphs];
                  updated[0] = e.target.value;
                  setConfig({ ...config, story: { ...config.story, paragraphs: updated } });
                }}
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Story Paragraph 2</label>
              <textarea
                className={styles.textarea}
                value={config.story.paragraphs[1] || ""}
                onChange={(e) => {
                  const updated = [...config.story.paragraphs];
                  updated[1] = e.target.value;
                  setConfig({ ...config, story: { ...config.story, paragraphs: updated } });
                }}
                rows={3}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Background Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.story.bgColor || "#f3f9f6"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        story: { ...config.story, bgColor: e.target.value, bgType: "color" },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.story.bgColor || "#f3f9f6"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Heading Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.story.headingColor || "#14854e"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        story: { ...config.story, headingColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.story.headingColor || "#14854e"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Body Text Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.story.textColor || "#374151"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        story: { ...config.story, textColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.story.textColor || "#374151"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PHILOSOPHY ================= */}
        {activeTab === "philosophy" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Layers size={20} color="#2e7d32" />
                The Ayurvedic Philosophy (Split Showcase)
              </h2>
              <label className={styles.toggleWrapper}>
                <input
                  type="checkbox"
                  checked={config.philosophy.isActive}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      philosophy: { ...config.philosophy, isActive: e.target.checked },
                    })
                  }
                />
                Section Active
              </label>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Heading</label>
                <input
                  type="text"
                  className={styles.input}
                  value={config.philosophy.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      philosophy: { ...config.philosophy, title: e.target.value },
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Image Position</label>
                <select
                  className={styles.select}
                  value={config.philosophy.imagePosition || "left"}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      philosophy: {
                        ...config.philosophy,
                        imagePosition: e.target.value as "left" | "right",
                      },
                    })
                  }
                >
                  <option value="left">Image on Left, Text on Right</option>
                  <option value="right">Image on Right, Text on Left</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Philosophy Description</label>
              <textarea
                className={styles.textarea}
                value={config.philosophy.description}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    philosophy: { ...config.philosophy, description: e.target.value },
                  })
                }
                rows={4}
              />
            </div>

            {/* Philosophy Image Uploader */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Section Image</label>
              <div
                className={styles.uploadContainer}
                onClick={() => philosophyFileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={philosophyFileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handlePhilosophyImgChange}
                />
                <div className={styles.uploadIconWrapper}>
                  <ImageIcon size={22} />
                </div>
                <p className={styles.uploadText}>
                  {philosophyImgFile ? philosophyImgFile.name : "Click to replace Philosophy Image"}
                </p>
                <p className={styles.uploadHint}>PNG, JPG, WebP (preserves crisp full ratio)</p>
              </div>
              {philosophyImgPreview && (
                <div className={styles.imagePreviewBox}>
                  <img src={philosophyImgPreview} alt="Philosophy preview" className={styles.previewImg} />
                </div>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Background Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.philosophy.bgColor || "#fffdf8"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        philosophy: { ...config.philosophy, bgColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.philosophy.bgColor || "#fffdf8"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Heading Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.philosophy.headingColor || "#111827"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        philosophy: { ...config.philosophy, headingColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.philosophy.headingColor || "#111827"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Text Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.philosophy.textColor || "#4b5563"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        philosophy: { ...config.philosophy, textColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.philosophy.textColor || "#4b5563"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: INGREDIENTS ================= */}
        {activeTab === "ingredients" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <CheckCircle2 size={20} color="#2e7d32" />
                Pure Ingredients Section
              </h2>
              <label className={styles.toggleWrapper}>
                <input
                  type="checkbox"
                  checked={config.ingredients.isActive}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ingredients: { ...config.ingredients, isActive: e.target.checked },
                    })
                  }
                />
                Section Active
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Heading</label>
              <input
                type="text"
                className={styles.input}
                value={config.ingredients.title}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    ingredients: { ...config.ingredients, title: e.target.value },
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={config.ingredients.description}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    ingredients: { ...config.ingredients, description: e.target.value },
                  })
                }
                rows={3}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Background Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.ingredients.bgColor || "#f3f9f6"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        ingredients: { ...config.ingredients, bgColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.ingredients.bgColor || "#f3f9f6"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Heading Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.ingredients.headingColor || "#111827"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        ingredients: { ...config.ingredients, headingColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.ingredients.headingColor || "#111827"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Text Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.ingredients.textColor || "#4b5563"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        ingredients: { ...config.ingredients, textColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.ingredients.textColor || "#4b5563"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: QUALITY & SAFETY ================= */}
        {activeTab === "quality" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <ShieldCheck size={20} color="#2e7d32" />
                Quality & Safety Section
              </h2>
              <label className={styles.toggleWrapper}>
                <input
                  type="checkbox"
                  checked={config.quality.isActive}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      quality: { ...config.quality, isActive: e.target.checked },
                    })
                  }
                />
                Section Active
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Heading</label>
              <input
                type="text"
                className={styles.input}
                value={config.quality.title}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    quality: { ...config.quality, title: e.target.value },
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={config.quality.description}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    quality: { ...config.quality, description: e.target.value },
                  })
                }
                rows={3}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Background Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.quality.bgColor || "#fffdf8"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        quality: { ...config.quality, bgColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.quality.bgColor || "#fffdf8"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Heading Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.quality.headingColor || "#111827"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        quality: { ...config.quality, headingColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.quality.headingColor || "#111827"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Text Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.quality.textColor || "#4b5563"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        quality: { ...config.quality, textColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.quality.textColor || "#4b5563"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: TRUST METRICS ================= */}
        {activeTab === "metrics" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <BarChart3 size={20} color="#2e7d32" />
                Trust Metrics Strip
              </h2>
              <label className={styles.toggleWrapper}>
                <input
                  type="checkbox"
                  checked={config.metrics.isActive}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      metrics: { ...config.metrics, isActive: e.target.checked },
                    })
                  }
                />
                Section Active
              </label>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Background Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.metrics.bgColor || "#14854e"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        metrics: { ...config.metrics, bgColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.metrics.bgColor || "#14854e"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Text Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.metrics.textColor || "#ffffff"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        metrics: { ...config.metrics, textColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.metrics.textColor || "#ffffff"}</span>
                </div>
              </div>
            </div>

            <label className={styles.label} style={{ marginTop: "12px" }}>
              Metric Numbers & Labels
            </label>
            {config.metrics.items.map((item, idx) => (
              <div key={idx} className={styles.formRow} style={{ marginBottom: "12px" }}>
                <input
                  type="text"
                  className={styles.input}
                  value={item.value}
                  onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                  placeholder="e.g. 10,000+"
                />
                <input
                  type="text"
                  className={styles.input}
                  value={item.label}
                  onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                  placeholder="e.g. Happy Customers"
                />
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => handleRemoveMetric(idx)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <button type="button" className={styles.addCustomBtn} onClick={handleAddMetric}>
              <Plus size={16} /> Add Metric Item
            </button>
          </div>
        )}

        {/* ================= TAB 7: CLOSING CTA ================= */}
        {activeTab === "closing" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <MessageSquare size={20} color="#2e7d32" />
                Closing Call-to-Action
              </h2>
              <label className={styles.toggleWrapper}>
                <input
                  type="checkbox"
                  checked={config.closing.isActive}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      closing: { ...config.closing, isActive: e.target.checked },
                    })
                  }
                />
                Section Active
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Heading</label>
              <input
                type="text"
                className={styles.input}
                value={config.closing.title}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    closing: { ...config.closing, title: e.target.value },
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Subtitle Text</label>
              <input
                type="text"
                className={styles.input}
                value={config.closing.subtitle}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    closing: { ...config.closing, subtitle: e.target.value },
                  })
                }
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Background Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.closing.bgColor || "#f3f9f6"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        closing: { ...config.closing, bgColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.closing.bgColor || "#f3f9f6"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Heading Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.closing.headingColor || "#111827"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        closing: { ...config.closing, headingColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.closing.headingColor || "#111827"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Text Color</label>
                <div className={styles.colorGroup}>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={config.closing.textColor || "#4b5563"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        closing: { ...config.closing, textColor: e.target.value },
                      })
                    }
                  />
                  <span className={styles.colorHex}>{config.closing.textColor || "#4b5563"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 8: DYNAMIC CUSTOM SECTIONS ================= */}
        {activeTab === "custom" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Plus size={20} color="#2e7d32" />
                Custom Sections Builder ({config.customSections.length})
              </h2>
              <button
                type="button"
                className={styles.saveBtn}
                style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                onClick={handleAddCustomSection}
              >
                <Plus size={16} />
                Add New Section
              </button>
            </div>

            {config.customSections.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#6b7280" }}>
                <Layers size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#374151" }}>
                  No Custom Sections Yet
                </h3>
                <p style={{ fontSize: "0.9rem", margin: "6px 0 16px" }}>
                  Click below to create additional custom sections for your About page with custom styling, background colors, and layouts.
                </p>
                <button
                  type="button"
                  className={styles.addCustomBtn}
                  style={{ maxWidth: "260px", margin: "0 auto" }}
                  onClick={handleAddCustomSection}
                >
                  <Plus size={16} /> Create First Custom Section
                </button>
              </div>
            ) : (
              config.customSections.map((sec, idx) => (
                <div key={sec.id} className={styles.customSectionCard}>
                  <div className={styles.customSectionHeader}>
                    <span className={styles.customSectionNumber}>
                      Section #{idx + 1}: {sec.title || "Untitled"}
                    </span>
                    <div className={styles.customSectionActions}>
                      <label className={styles.toggleWrapper} style={{ marginRight: "12px" }}>
                        <input
                          type="checkbox"
                          checked={sec.isActive !== false}
                          onChange={(e) =>
                            handleCustomSectionChange(sec.id, "isActive", e.target.checked)
                          }
                        />
                        Active
                      </label>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleRemoveCustomSection(sec.id)}
                        title="Delete section"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Layout Style</label>
                      <select
                        className={styles.select}
                        value={sec.layout}
                        onChange={(e) =>
                          handleCustomSectionChange(sec.id, "layout", e.target.value)
                        }
                      >
                        <option value="center">Centered Text Box</option>
                        <option value="split-left">Split (Image Left, Text Right)</option>
                        <option value="split-right">Split (Image Right, Text Left)</option>
                        <option value="banner">Full Width Highlight Banner</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tag / Badge (Optional)</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={sec.tag || ""}
                        onChange={(e) =>
                          handleCustomSectionChange(sec.id, "tag", e.target.value)
                        }
                        placeholder="e.g. OUR COMMITMENT"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Section Title / Heading</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={sec.title}
                      onChange={(e) =>
                        handleCustomSectionChange(sec.id, "title", e.target.value)
                      }
                      placeholder="e.g. Handcrafted with Love"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Section Content</label>
                    <textarea
                      className={styles.textarea}
                      value={sec.content}
                      onChange={(e) =>
                        handleCustomSectionChange(sec.id, "content", e.target.value)
                      }
                      rows={4}
                      placeholder="Enter description, story, or bullet points..."
                    />
                  </div>

                  {/* Image Upload for split layout */}
                  {(sec.layout === "split-left" || sec.layout === "split-right") && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Section Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.input}
                        onChange={(e) => handleCustomFileChange(sec.id, "img", e)}
                      />
                      {(customPreviews[`custom_img_${sec.id}`] || sec.imageUrl) && (
                        <div className={styles.imagePreviewBox}>
                          <img
                            src={customPreviews[`custom_img_${sec.id}`] || sec.imageUrl}
                            alt="Section preview"
                            className={styles.previewImg}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Colors & Background Controls */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Background Color</label>
                      <div className={styles.colorGroup}>
                        <input
                          type="color"
                          className={styles.colorInput}
                          value={sec.bgColor || "#ffffff"}
                          onChange={(e) =>
                            handleCustomSectionChange(sec.id, "bgColor", e.target.value)
                          }
                        />
                        <span className={styles.colorHex}>{sec.bgColor || "#ffffff"}</span>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Heading Color</label>
                      <div className={styles.colorGroup}>
                        <input
                          type="color"
                          className={styles.colorInput}
                          value={sec.headingColor || "#111827"}
                          onChange={(e) =>
                            handleCustomSectionChange(sec.id, "headingColor", e.target.value)
                          }
                        />
                        <span className={styles.colorHex}>{sec.headingColor || "#111827"}</span>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Text Color</label>
                      <div className={styles.colorGroup}>
                        <input
                          type="color"
                          className={styles.colorInput}
                          value={sec.textColor || "#4b5563"}
                          onChange={(e) =>
                            handleCustomSectionChange(sec.id, "textColor", e.target.value)
                          }
                        />
                        <span className={styles.colorHex}>{sec.textColor || "#4b5563"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {config.customSections.length > 0 && (
              <button
                type="button"
                className={styles.addCustomBtn}
                onClick={handleAddCustomSection}
              >
                <Plus size={16} />
                Add Another Custom Section
              </button>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </DashboardLayout>
  );
}
