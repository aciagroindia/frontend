"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../../components/admin-layout/DashboardLayout";
import AdvancedTable from "../../../../../components/admin-ui/AdvancedTable";
import Modal from "../../../../../components/admin-ui/Modal";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Image as ImageIcon, Film } from "lucide-react";
import styles from "../../products/ProductsPage.module.css";

interface AboutMedia {
  _id: string;
  type: "image" | "video";
  url: string;
  title?: string;
  createdAt: string;
}

export default function AboutMediaPage() {
  const [mediaItems, setMediaItems] = useState<AboutMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", file: null as File | null });
  const [mediaToDelete, setMediaToDelete] = useState<AboutMedia | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/about-media");
      if (res.data.success) {
        setMediaItems(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error("Please select a file");
      return;
    }

    const payload = new FormData();
    if (formData.title) payload.append("title", formData.title);
    payload.append("file", formData.file);

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/about-media", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("Media added successfully");
        setIsModalOpen(false);
        setFormData({ title: "", file: null });
        fetchMedia();
      }
    } catch (error) {
      toast.error("Failed to upload media");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (item: AboutMedia) => {
    setMediaToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!mediaToDelete) return;
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.delete(`/about-media/${mediaToDelete._id}`);
      if (res.data.success) {
        toast.success("Media deleted");
        fetchMedia();
      }
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsSubmitting(false);
      setMediaToDelete(null);
    }
  };

  const columns = [
    {
      key: "type",
      label: "Type",
      render: (val: string) => val === "video" ? <Film size={20} /> : <ImageIcon size={20} />,
    },
    {
      key: "url",
      label: "Preview",
      render: (val: string, row: AboutMedia) => (
        row.type === "video" ? (
          <video src={val} style={{ width: "100px", borderRadius: "4px" }} muted />
        ) : (
          <img src={val} alt="Preview" style={{ width: "100px", borderRadius: "4px" }} />
        )
      ),
    },
    { key: "title", label: "Title / Caption" },
    {
      key: "createdAt",
      label: "Date",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: AboutMedia) => (
        <button onClick={() => handleDeleteClick(row)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>
          <Trash2 size={18} />
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>About Page Media</h1>
          <p className={styles.subtitle}>Manage images and videos for your About Us page</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Media
        </button>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <p style={{ padding: "20px" }}>Loading media...</p>
        ) : (
          <AdvancedTable columns={columns} data={mediaItems} />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Image or Video">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            placeholder="Title / Caption (Optional)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#666" }}>Select Image or Video</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              style={{ padding: "10px" }}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: "#0f5132",
              color: "white",
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isSubmitting ? "Uploading..." : "Save Media"}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!mediaToDelete}
        onClose={() => setMediaToDelete(null)}
        title="Confirm Deletion"
      >
        {mediaToDelete && (
          <div>
            <p style={{ margin: "0 0 1rem" }}>
              Are you sure you want to delete this media item? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              {mediaToDelete.type === "video" ? (
                <video src={mediaToDelete.url} style={{ width: "150px", borderRadius: "4px" }} controls muted />
              ) : (
                <img src={mediaToDelete.url} alt="Preview" style={{ width: "150px", borderRadius: "4px" }} />
              )}
            </div>
            <div className={styles.modalFooter} style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", paddingTop: '1rem' }}>
              <button
                onClick={() => setMediaToDelete(null)}
                disabled={isSubmitting}
                className={styles.secondaryButton}
                style={{ background: '#e5e7eb', color: '#374151', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className={styles.deleteButton}
                style={{ background: isSubmitting ? '#fca5a5' : '#ef4444', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
