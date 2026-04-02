'use client';

import { useState, useEffect, FormEvent, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Upload, Bold, Italic, List, ListOrdered } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styles from "./Categories.module.css";
import type { Category } from "../../context/CategoryContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<boolean>;
  category: Category | null;
}

export default function EditCategoryModal({ isOpen, onClose, onSubmit, category }: Props) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: { attributes: { class: styles.tiptapEditor } },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (category) {
      setName(category.name);
      setStatus(category.status);
      setImagePreview(category.image);
      setImageFile(null);
      if (editor) editor.commands.setContent(category.description || "");
    }
  }, [category, editor, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!category) return;
    setIsSubmitting(true);

    const form = new FormData();
    form.append("id", category._id); // ✅ Add ID to body for backend
    form.append("name", name);
    form.append("description", editor?.getHTML() || "");
    form.append("status", status);
    if (imageFile) form.append("image", imageFile);

    // ✅ Logic Fix: Wait for update result
    const success = await onSubmit(form);
    setIsSubmitting(false);
    if (success) onClose();
  };

  if (!isOpen || !category) return null;

  return createPortal(
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Category</h2>
          <button onClick={onClose} className={styles.modalCloseButton}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="edit-name">Category Name</label>
            <input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label>Category Image</label>
            <div className={styles.fileInputContainer}>
              {imagePreview && (
                <div className={styles.imagePreviewWrapper}>
                  <Image src={imagePreview} alt="Preview" width={50} height={50} className={styles.categoryImage} />
                </div>
              )}
              <label htmlFor="edit-image" className={styles.fileInputLabel}>
                <Upload size={16} /> <span>Change File</span>
              </label>
              <input type="file" id="edit-image" accept="image/*" onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }} className={styles.fileInput} />
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
            <label htmlFor="edit-status">Status</label>
            <select id="edit-status" value={status} onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.secondaryButton}>Cancel</button>
            <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}