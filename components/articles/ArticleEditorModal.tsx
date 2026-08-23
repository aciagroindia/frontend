"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { 
  X, 
  Upload, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Eye, 
  Edit3,
  Plus,
  Trash2,
  HelpCircle
} from "lucide-react";
import styles from "./ArticleEditorModal.module.css";
import { toast } from "react-hot-toast";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ArticleData {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  image?: string;
  faqs?: FaqItem[];
  status: "Published" | "Draft";
  views?: number;
  createdAt?: string;
}

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, id?: string) => Promise<void>;
  initialData?: ArticleData | null;
  isSaving: boolean;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Process content so that standalone bold lines are formatted as clean headings
export const formatArticleContent = (htmlContent: string) => {
  if (!htmlContent) return "";
  return htmlContent
    .replace(/<p>\s*<(?:strong|b)>(.*?)<\/(?:strong|b)>\s*<\/p>/gi, '<h2 class="articleHeading">$1</h2>')
    .replace(/<div>\s*<(?:strong|b)>(.*?)<\/(?:strong|b)>\s*<\/div>/gi, '<h2 class="articleHeading">$1</h2>');
};

export default function ArticleEditorModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSaving,
}: ArticleEditorModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  const contentEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || "");
        setContent(initialData.content || "");
        setFaqs(initialData.faqs && Array.isArray(initialData.faqs) ? initialData.faqs : []);
        setStatus(initialData.status || "Published");
        setImagePreview(initialData.image || null);
      } else {
        setTitle("");
        setContent("");
        setFaqs([]);
        setStatus("Published");
        setImageFile(null);
        setImagePreview(null);
      }
      setImageFile(null);
      setActiveTab("editor");
    }
  }, [isOpen, initialData]);

  // Sync content with contentEditable DOM element
  useEffect(() => {
    if (activeTab === "editor" && contentEditableRef.current) {
      if (contentEditableRef.current.innerHTML !== content) {
        contentEditableRef.current.innerHTML = content;
      }
    }
  }, [activeTab, content]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const formatDoc = (cmd: string, val?: string) => {
    if (activeTab !== "editor") return;
    document.execCommand(cmd, false, val);
    if (contentEditableRef.current) {
      setContent(contentEditableRef.current.innerHTML);
    }
  };

  const handleContentInput = () => {
    if (contentEditableRef.current) {
      setContent(contentEditableRef.current.innerHTML);
    }
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    setFaqs(prev => [...prev, { question: "", answer: "" }]);
  };

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    setFaqs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Article title is required.");
      return;
    }
    if (!content.trim()) {
      toast.error("Article content is required.");
      return;
    }
    if (!initialData && !imageFile) {
      toast.error("Please upload a banner image for the article.");
      return;
    }

    // Auto-generate clean slug
    const autoSlug = slugify(title.trim()) || `article-${Date.now()}`;
    
    // Auto-generate excerpt from plain text
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const autoDescription = plainText.length > 180 ? `${plainText.substring(0, 180)}...` : plainText || title;

    // Filter valid FAQs
    const validFaqs = faqs.filter(f => f.question.trim() && f.answer.trim());

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("slug", autoSlug);
    formData.append("breadcrumbTitle", title.trim());
    formData.append("description", autoDescription);
    formData.append("content", content);
    formData.append("status", status);
    formData.append("faqs", JSON.stringify(validFaqs));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const articleId = initialData?._id || initialData?.id;
    await onSubmit(formData, articleId);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>{initialData ? "Edit Article" : "Write New Article"}</h2>
          <button type="button" onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Article Title */}
          <div className={styles.formGroup}>
            <label htmlFor="article-title">Article Title *</label>
            <input
              type="text"
              id="article-title"
              placeholder="e.g. How to Use Ashwagandha Powder with Water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Main / Banner Image */}
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Article Banner / Main Image *</label>
              <span className={styles.ratioBadge}>
                📐 16:9 Ratio (1200 × 675 px)
              </span>
            </div>
            <div className={styles.imageUploadSection}>
              <label htmlFor="article-image-upload" className={styles.uploadLabel}>
                <Upload size={17} className={styles.uploadIcon} />
                <span className={styles.uploadText}>{imagePreview ? "Change Image" : "Upload Image"}</span>
              </label>
              <span className={styles.uploadFormatText}>JPG, PNG, WebP (16:9 Landscape)</span>
              <input
                type="file"
                id="article-image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <Image
                    src={imagePreview}
                    alt="Article Main Image"
                    fill
                    sizes="200px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Simple Content Editor */}
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Article Content *</label>
              <span className={styles.hint}>
                💡 Standalone bold line = <strong>Heading</strong>. Inline bold = normal bold text.
              </span>
            </div>
            
            <div className={styles.editorContainer}>
              {/* Toolbar */}
              <div className={styles.toolbar}>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => formatDoc("bold")}
                  title="Bold Line / Text"
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
                <div className={styles.tabControls}>
                  <button
                    type="button"
                    className={`${styles.toolBtn} ${activeTab === "editor" ? styles.activeTabBtn : ""}`}
                    onClick={() => setActiveTab("editor")}
                  >
                    <Edit3 size={14} /> Write
                  </button>
                  <button
                    type="button"
                    className={`${styles.toolBtn} ${activeTab === "preview" ? styles.activeTabBtn : ""}`}
                    onClick={() => setActiveTab("preview")}
                  >
                    <Eye size={14} /> Preview
                  </button>
                </div>
              </div>

              {/* Editable Area / Preview Area */}
              {activeTab === "editor" ? (
                <div
                  ref={contentEditableRef}
                  className={styles.contentArea}
                  contentEditable
                  onInput={handleContentInput}
                  data-placeholder="Write your article here. Make an entire new line bold to turn it into a heading, or bold any words inside paragraphs..."
                />
              ) : (
                <div className={styles.previewArea}>
                  <div dangerouslySetInnerHTML={{ __html: formatArticleContent(content) || "<p>No content to preview.</p>" }} />

                  {/* FAQs in Preview */}
                  {faqs.some(f => f.question.trim()) && (
                    <div className={styles.previewFaqSection}>
                      <h3>Frequently Asked Questions</h3>
                      {faqs.filter(f => f.question.trim()).map((faq, idx) => (
                        <div key={idx} className={styles.previewFaqItem}>
                          <strong>Q: {faq.question}</strong>
                          <p>A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* FAQs and Answers Section */}
          <div className={styles.faqContainer}>
            <div className={styles.faqHeader}>
              <div className={styles.faqTitleGroup}>
                <HelpCircle size={18} className={styles.faqIcon} />
                <label>Frequently Asked Questions (FAQs)</label>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className={styles.addFaqBtn}
              >
                <Plus size={15} /> Add FAQ
              </button>
            </div>

            {faqs.length === 0 ? (
              <p className={styles.noFaqsText}>
                No FAQs added yet. Click &quot;Add FAQ&quot; to add questions and answers for this article.
              </p>
            ) : (
              <div className={styles.faqsList}>
                {faqs.map((faq, index) => (
                  <div key={index} className={styles.faqCard}>
                    <div className={styles.faqCardHeader}>
                      <span className={styles.faqIndex}>FAQ #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(index)}
                        className={styles.deleteFaqBtn}
                        title="Remove FAQ"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Question (e.g. Can I take Ashwagandha with water?)"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                      className={styles.faqInput}
                    />

                    <textarea
                      placeholder="Answer (e.g. Yes, taking it with lukewarm water is safe and effective...)"
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                      rows={2}
                      className={styles.faqTextarea}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Selection */}
          <div className={styles.formGroup} style={{ maxWidth: "260px" }}>
            <label htmlFor="article-status">Status</label>
            <select
              id="article-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "Published" | "Draft")}
            >
              <option value="Published">Published (Live on Website)</option>
              <option value="Draft">Draft (Hidden)</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : initialData ? "Save Changes" : "Publish Article"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
