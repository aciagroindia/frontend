"use client";
import imageCompression from "browser-image-compression";

import { useState, useEffect, FormEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Upload, Bold, Italic, List, ListOrdered } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styles from "./Categories.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<boolean>; // Added Promise return
}

export default function AddCategoryModal({ isOpen, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      setName(""); setStatus("Active"); setImagePreview(null); setImageFile(null);
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

// AddCategoryModal.tsx mein handleSubmit change karein
const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("name", name);
    form.append("description", editor?.getHTML() || "");
    form.append("status", status);

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