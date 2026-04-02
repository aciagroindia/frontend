"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../../components/admin-layout/DashboardLayout";
import AdvancedTable from "../../../../../components/admin-ui/AdvancedTable";
import Modal from "../../../../../components/admin-ui/Modal";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import styles from "../../products/ProductsPage.module.css"; // Reuse product page styles

interface Certificate {
  _id: string;
  title: string;
  image: string;
  createdAt: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", image: null as File | null });

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/certificates");
      if (res.data.success) {
        setCertificates(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      toast.error("Please provide both title and image");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("image", formData.image);

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/certificates", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("Certificate added successfully");
        setIsModalOpen(false);
        setFormData({ title: "", image: null });
        fetchCertificates();
      }
    } catch (error) {
      toast.error("Failed to add certificate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      const res = await axiosInstance.delete(`/certificates/${id}`);
      if (res.data.success) {
        toast.success("Certificate deleted");
        fetchCertificates();
      }
    } catch (error) {
      toast.error("Failed to delete certificate");
    }
  };

  const columns = [
    {
      key: "image",
      label: "Preview",
      render: (val: string) => (
        <img src={val} alt="Cert" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
      ),
    },
    { key: "title", label: "Certificate Name" },
    {
      key: "createdAt",
      label: "Date Added",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: Certificate) => (
        <button onClick={() => handleDelete(row._id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>
          <Trash2 size={18} />
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Certificates Management</h1>
          <p className={styles.subtitle}>Manage your quality and authenticity certificates</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add New Certificate
        </button>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <p style={{ padding: "20px" }}>Loading certificates...</p>
        ) : (
          <AdvancedTable columns={columns} data={certificates} />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Certificate">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            placeholder="Certificate Title (e.g. GMP Certified)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
            style={{ padding: "10px" }}
            required
          />
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
            {isSubmitting ? "Uploading..." : "Save Certificate"}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
