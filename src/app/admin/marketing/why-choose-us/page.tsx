"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../../../../components/admin-layout/DashboardLayout";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import {
  UploadCloud,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Image as ImageIcon,
  Info,
  CheckCircle2,
  Eye,
  Layers,
} from "lucide-react";
import ConfirmationModal from "../../../../../components/signUP/ConfirmationModal";
import styles from "./whyChooseUsAdmin.module.css";

interface Point {
  title: string;
  description: string;
}

interface WhyChooseUsData {
  _id?: string;
  tag: string;
  mainHeading: string;
  heading: string;
  subheading: string;
  description: string;
  points: Point[];
  imageUrl: string;
  isActive: boolean;
}

const DEFAULT_DATA: WhyChooseUsData = {
  tag: "ROOTED IN TRADITION",
  mainHeading: "WHY CHOOSE US",
  heading: "Crafted by Nature.",
  subheading: "Powered by ACI.",
  description:
    "ACI me hum ancient Ayurvedic wisdom ko modern science ke saath combine karke aise products banate hain jo aapke body ko naturally nourish kare. Har ingredient carefully source kiya jata hai, ethically process hota hai, aur proper testing ke baad hi use hota hai — taaki aapko mile pure, natural aur trusted wellness.",
  points: [
    {
      title: "✔ 100% Natural",
      description: "No artificial additives or preservatives.",
    },
    {
      title: "✔ Ethically Sourced",
      description: "Direct partnerships with trusted farmers.",
    },
    {
      title: "✔ Lab Tested",
      description: "Strict quality control for every batch.",
    },
  ],
  imageUrl: "/certifiedIcons/whychooseus.png",
  isActive: true,
};

export default function WhyChooseUsAdminPage() {
  const [formData, setFormData] = useState<WhyChooseUsData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/certifiedIcons/whychooseus.png");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const fetchSectionData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/why-choose-us");
      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        setFormData({
          _id: data._id,
          tag: data.tag || DEFAULT_DATA.tag,
          mainHeading: data.mainHeading || DEFAULT_DATA.mainHeading,
          heading: data.heading || DEFAULT_DATA.heading,
          subheading: data.subheading || DEFAULT_DATA.subheading,
          description: data.description || DEFAULT_DATA.description,
          points: data.points && data.points.length > 0 ? data.points : DEFAULT_DATA.points,
          imageUrl: data.imageUrl || DEFAULT_DATA.imageUrl,
          isActive: data.isActive !== undefined ? data.isActive : true,
        });
        setImagePreview(data.imageUrl || DEFAULT_DATA.imageUrl);
      }
    } catch (error) {
      toast.error("Failed to load section data. Using default template.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handlePointChange = (index: number, field: "title" | "description", value: string) => {
    const updatedPoints = [...formData.points];
    updatedPoints[index] = {
      ...updatedPoints[index],
      [field]: value,
    };
    setFormData({ ...formData, points: updatedPoints });
  };

  const handleAddPoint = () => {
    setFormData({
      ...formData,
      points: [...formData.points, { title: "✔ Feature Title", description: "Short description of the feature." }],
    });
  };

  const handleRemovePoint = (index: number) => {
    if (formData.points.length <= 1) {
      toast.error("Must have at least one key point");
      return;
    }
    const updatedPoints = formData.points.filter((_, i) => i !== index);
    setFormData({ ...formData, points: updatedPoints });
  };

  const handleResetToDefault = () => {
    setShowResetModal(true);
  };

  const confirmResetToDefault = () => {
    setShowResetModal(false);
    setFormData(DEFAULT_DATA);
    setImageFile(null);
    setImagePreview(DEFAULT_DATA.imageUrl);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Reset to defaults");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = new FormData();
      payload.append("tag", formData.tag);
      payload.append("mainHeading", formData.mainHeading);
      payload.append("heading", formData.heading);
      payload.append("subheading", formData.subheading);
      payload.append("description", formData.description);
      payload.append("isActive", String(formData.isActive));
      payload.append("points", JSON.stringify(formData.points));

      if (imageFile) {
        payload.append("image", imageFile);
      } else {
        payload.append("imageUrl", formData.imageUrl);
      }

      const res = await axiosInstance.put("/why-choose-us", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success("Section updated successfully!");
        setImageFile(null);
        if (res.data.data?.imageUrl) {
          setFormData((prev) => ({ ...prev, imageUrl: res.data.data.imageUrl }));
          setImagePreview(res.data.data.imageUrl);
        }
      }
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Top Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Why Choose Us / Crafted by Nature</h1>
            <p className={styles.subtitle}>
              Manage the image and content displayed in the "Crafted by Nature" showcase on your home page.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleResetToDefault}
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
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className={styles.grid}>
          {/* Left Column: Form Controls */}
          <div>
            {/* 1. Image Manager */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <ImageIcon size={20} color="#2e7d32" />
                  Showcase Image
                </h2>
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  PNG / JPG / WEBP (Preserves full ratio)
                </span>
              </div>

              <div
                className={styles.uploadContainer}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageChange}
                />
                <div className={styles.uploadIconWrapper}>
                  <UploadCloud size={24} />
                </div>
                <p className={styles.uploadText}>
                  {imageFile ? imageFile.name : "Click to browse or replace image"}
                </p>
                <p className={styles.uploadHint}>
                  Transparent PNG or high-res product photo recommended
                </p>
              </div>

              {/* Current / Preview Image Container */}
              <div className={styles.imagePreviewBox}>
                <img
                  src={imagePreview}
                  alt="Crafted by nature preview"
                  className={styles.previewImg}
                />
              </div>

              {/* Ratio Note */}
              <div className={styles.ratioNote}>
                <Info size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>
                  <strong>Aspect Ratio Preservation:</strong> The image container automatically adapts with
                  <code>object-fit: contain</code>. Your uploaded image will <strong>never get cropped or cut off</strong> on mobile or desktop screens.
                </span>
              </div>
            </div>

            {/* 2. Text & Headlines */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <Layers size={20} color="#2e7d32" />
                  Headings & Description
                </h2>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Top Section Header</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.mainHeading}
                  onChange={(e) => setFormData({ ...formData, mainHeading: e.target.value })}
                  placeholder="e.g. WHY CHOOSE US"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tag Badge</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. ROOTED IN TRADITION"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Subheading (Green highlight)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.subheading}
                    onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                    placeholder="e.g. Powered by ACI."
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Main Heading Title</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.heading}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="e.g. Crafted by Nature."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description Text</label>
                <textarea
                  className={styles.textarea}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Enter detailed description..."
                />
              </div>
            </div>

            {/* 3. Key Bullet Points */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <CheckCircle2 size={20} color="#2e7d32" />
                  Key Feature Points
                </h2>
              </div>

              {formData.points.map((point, index) => (
                <div key={index} className={styles.pointCard}>
                  <div className={styles.pointCardHeader}>
                    <span className={styles.pointIndex}>Point #{index + 1}</span>
                    <button
                      type="button"
                      className={styles.removePointBtn}
                      onClick={() => handleRemovePoint(index)}
                      title="Remove point"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      className={styles.input}
                      value={point.title}
                      onChange={(e) => handlePointChange(index, "title", e.target.value)}
                      placeholder="Title (e.g. ✔ 100% Natural)"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      className={styles.input}
                      value={point.description}
                      onChange={(e) => handlePointChange(index, "description", e.target.value)}
                      placeholder="Short explanation..."
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                className={styles.addPointBtn}
                onClick={handleAddPoint}
              >
                <Plus size={16} />
                Add Another Point
              </button>
            </div>
          </div>

          {/* Right Column: Live Synchronous Preview */}
          <div className={styles.previewSticky}>
            <div className={styles.livePreviewWrapper}>
              <div className={styles.livePreviewBadge}>
                <Eye size={14} />
                LIVE HOMEPAGE PREVIEW
              </div>

              <div className={styles.previewSection}>
                <div style={{ textAlign: "center", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
                    {formData.mainHeading || "WHY CHOOSE US"}
                  </h3>
                </div>

                <div>
                  <span className={styles.previewTag}>
                    {formData.tag || "ROOTED IN TRADITION"}
                  </span>

                  <h2 className={styles.previewHeading}>
                    {formData.heading || "Crafted by Nature."}{" "}
                    {formData.subheading && (
                      <span>{formData.subheading}</span>
                    )}
                  </h2>

                  <p className={styles.previewDesc}>
                    {formData.description}
                  </p>
                </div>

                {/* Points Preview */}
                <div className={styles.previewPoints}>
                  {formData.points.map((p, idx) => (
                    <div key={idx} className={styles.previewPointItem}>
                      <strong>{p.title}</strong>
                      <p>{p.description}</p>
                    </div>
                  ))}
                </div>

                {/* Image Preview */}
                <div className={styles.previewImgContainer}>
                  <img
                    src={imagePreview}
                    alt="Why choose us live preview"
                    className={styles.previewImgDisplay}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={confirmResetToDefault}
        title="Reset Configuration"
        message="Reset all fields and image to original defaults? Any unsaved changes will be lost."
      />
    </DashboardLayout>
  );
}
