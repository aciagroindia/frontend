"use client";
import imageCompression from "browser-image-compression";

import { useState, useEffect, FormEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Upload, Bold, Italic, List, ListOrdered, Plus, Trash2 } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styles from "./Categories.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<boolean>; // Added Promise return
}

interface ComboRuleForm {
  quantity: number | string;
  fixedPrice: number | string;
}

export default function AddCategoryModal({ isOpen, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [comboRules, setComboRules] = useState<ComboRuleForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    editorProps: { attributes: { class: styles.tiptapEditor } },
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setName(""); setStatus("Active"); setImagePreview(null); setImageFile(null); setComboRules([]);
      editor?.commands.setContent("");
    }
  }, [isOpen, editor]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addComboRule = () => {
    setComboRules(prev => [...prev, { quantity: 2, fixedPrice: "" }]);
  };

  const updateComboRule = (index: number, field: "quantity" | "fixedPrice", value: string) => {
    setComboRules(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeComboRule = (index: number) => {
    setComboRules(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("name", name);
    form.append("description", editor?.getHTML() || "");
    form.append("status", status);

    const validComboRules = comboRules
      .map(r => ({ quantity: Number(r.quantity), fixedPrice: Number(r.fixedPrice) }))
      .filter(r => !isNaN(r.quantity) && r.quantity >= 2 && !isNaN(r.fixedPrice) && r.fixedPrice > 0);

    form.append("comboRules", JSON.stringify(validComboRules));

    if (imageFile) {
      try {
        const compressed = await imageCompression(imageFile, {
          maxSizeMB: 0.2, // 200KB is enough for categories
          maxWidthOrHeight: 500,
          useWebWorker: true, // ✅ UI freeze nahi hoga
        });
        form.append("image", compressed);
      } catch (error) {
        setIsSubmitting(false);
        return console.error("Image processing failed");
      }
    }

    const success = await onSubmit(form);
    setIsSubmitting(false); // Modal ke andar ka state update
    if (success) onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Add Category</h2>
          <button onClick={onClose} className={styles.modalCloseButton}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="add-name">Category Name</label>
            <input id="add-name" placeholder="Enter category name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label>Category Image</label>
            <div className={styles.fileInputContainer}>
              {imagePreview && (
                <div className={styles.imagePreviewWrapper}>
                  <Image src={imagePreview} alt="Image preview" width={50} height={50} className={styles.categoryImage} />
                </div>
              )}
              <label htmlFor="add-image" className={styles.fileInputLabel}>
                <Upload size={16} /> <span>{imageFile ? "Change File" : "Choose File"}</span>
              </label>
              <input type="file" id="add-image" accept="image/*" onChange={handleImage} className={styles.fileInput} required />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <div className={styles.editorContainer}>
              <div className={styles.editorToolbar}>
                <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}><Bold size={16} /></button>
                <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic size={16} /></button>
                <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}><List size={16} /></button>
                <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></button>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Combo Pricing Rules Section */}
          <div className={styles.comboRulesSection}>
            <div className={styles.comboHeader}>
              <div>
                <h4 className={styles.comboTitle}>Combo Pricing Rules</h4>
                <p className={styles.comboHelpText}>Set bundle deals (e.g. Any 2 items for ₹799, Any 3 items for ₹1099)</p>
              </div>
              <button type="button" onClick={addComboRule} className={styles.addComboBtn}>
                <Plus size={14} /> Add Tier
              </button>
            </div>

            {comboRules.length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "4px 0" }}>No combo rules configured. Click &quot;Add Tier&quot; to create a combo deal for this category.</p>
            ) : (
              comboRules.map((rule, idx) => (
                <div key={idx} className={styles.comboRuleRow}>
                  <div className={styles.comboInputGroup}>
                    <label>Quantity (Min 2)</label>
                    <input
                      type="number"
                      min={2}
                      placeholder="e.g. 2"
                      value={rule.quantity}
                      onChange={(e) => updateComboRule(idx, "quantity", e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.comboInputGroup}>
                    <label>Fixed Combo Price (₹)</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="e.g. 799"
                      value={rule.fixedPrice}
                      onChange={(e) => updateComboRule(idx, "fixedPrice", e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeComboRule(idx)}
                    className={styles.comboDeleteBtn}
                    title="Remove rule"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="add-status">Status</label>
            <select id="add-status" value={status} onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.secondaryButton}>Cancel</button>
            <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}