"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import AdvancedTable from "../../../../components/admin-ui/AdvancedTable";
import Modal from "../../../../components/admin-ui/Modal";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import { Trash2, Sparkles } from "lucide-react";
import ConfirmationModal from "../../../../components/signUP/ConfirmationModal";
import styles from "./BulkInquiryPage.module.css";

interface BulkInquiry {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  message: string;
  status: "New" | "Contacted" | "Closed";
  createdAt: string;
}

export default function BulkInquiryPage() {
  const [inquiries, setInquiries] = useState<BulkInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<BulkInquiry | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [cleaning, setCleaning] = useState(false);
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

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/inquiries");
      if (res.data.success) {
        setInquiries(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const closedCount = inquiries.filter((i) => i.status === "Closed").length;

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await axiosInstance.patch(`/admin/inquiries/${id}`, {
        status: newStatus,
      });
      if (res.data.success) {
        toast.success("Status updated");
        setInquiries((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus as any } : item))
        );
        if (selectedInquiry?._id === id) {
          setSelectedInquiry((prev) => prev ? { ...prev, status: newStatus as any } : null);
        }
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDeleteSingle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setModalConfig({
      isOpen: true,
      title: "Delete Inquiry",
      message: "Are you sure you want to delete this inquiry record? This cannot be undone.",
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          const res = await axiosInstance.delete(`/admin/inquiries/${id}`);
          if (res.data.success) {
            toast.success("Inquiry deleted successfully");
            setInquiries((prev) => prev.filter((item) => item._id !== id));
            setSelectedIds((prev) => prev.filter((item) => item !== id));
            if (selectedInquiry?._id === id) {
              setSelectedInquiry(null);
            }
          }
        } catch (error) {
          toast.error("Failed to delete inquiry");
        }
      },
    });
  };

  const handleCleanClosed = () => {
    if (closedCount === 0) {
      toast.success("No closed inquiries found to clean!");
      return;
    }

    setModalConfig({
      isOpen: true,
      title: "Clean Closed Inquiries",
      message: `Are you sure you want to permanently delete all ${closedCount} closed inquiries?`,
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          setCleaning(true);
          const res = await axiosInstance.delete("/admin/inquiries/cleanup/closed");
          if (res.data.success) {
            toast.success(res.data.message || "Closed inquiries cleaned up successfully!");
            setInquiries((prev) => prev.filter((item) => item.status !== "Closed"));
            setSelectedIds([]);
          }
        } catch (error) {
          toast.error("Failed to clean closed inquiries");
        } finally {
          setCleaning(false);
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    setModalConfig({
      isOpen: true,
      title: "Delete Selected Inquiries",
      message: `Are you sure you want to delete ${selectedIds.length} selected inquiries? This action cannot be undone.`,
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          setCleaning(true);
          const res = await axiosInstance.post("/admin/inquiries/bulk-delete", {
            ids: selectedIds,
          });
          if (res.data.success) {
            toast.success(res.data.message || "Selected inquiries deleted successfully");
            setInquiries((prev) => prev.filter((item) => !selectedIds.includes(item._id)));
            setSelectedIds([]);
          }
        } catch (error) {
          toast.error("Failed to delete selected inquiries");
        } finally {
          setCleaning(false);
        }
      },
    });
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === inquiries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(inquiries.map((i) => i._id));
    }
  };

  const columns = [
    {
      key: "select",
      sortable: false,
      label: (
        <input
          type="checkbox"
          checked={inquiries.length > 0 && selectedIds.length === inquiries.length}
          onChange={toggleSelectAll}
          title="Select All"
          style={{ cursor: "pointer" }}
        />
      ),
      render: (_: any, row: BulkInquiry) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row._id)}
          onChange={() => toggleSelectRow(row._id)}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    { key: "name", label: "Customer Name" },
    { 
      key: "mobile", 
      label: "Mobile",
      render: (val: string) => val.length > 10 ? val.slice(-10) : val
    },
    {
      key: "message",
      label: "Message",
      render: (val: string) => (
        <span title={val}>
          {val.length > 30 ? val.substring(0, 30) + "..." : val}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val: string) => (
        <span className={`${styles.statusBadge} ${styles[val.toLowerCase()]}`}>
          {val}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: any, row: BulkInquiry) => (
        <div className={styles.tableActions}>
          <button className={styles.viewBtn} onClick={() => setSelectedInquiry(row)}>
            View
          </button>
          <button
            className={styles.deleteBtn}
            onClick={(e) => handleDeleteSingle(row._id, e)}
            title="Delete Inquiry Record"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Bulk Order Inquiries</h1>
          <p className={styles.subtitle}>Manage and track large order requests</p>
        </div>

        <div className={styles.headerActions}>
          {selectedIds.length > 0 && (
            <button
              className={styles.bulkDeleteBtn}
              onClick={handleBulkDelete}
              disabled={cleaning}
            >
              <Trash2 size={16} />
              Delete Selected ({selectedIds.length})
            </button>
          )}

          <button
            className={styles.cleanClosedBtn}
            onClick={handleCleanClosed}
            disabled={cleaning || closedCount === 0}
            title="Clean all closed inquiries from table"
          >
            <Sparkles size={16} />
            Clean Closed Inquiries ({closedCount})
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <p>Loading inquiries...</p>
        ) : (
          <AdvancedTable columns={columns} data={inquiries} />
        )}
      </div>

      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Inquiry Details"
      >
        {selectedInquiry && (
          <div className={styles.modalContent}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Name</span>
              <span className={styles.value}>{selectedInquiry.name}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{selectedInquiry.email}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Mobile</span>
              <span className={styles.value}>{selectedInquiry.mobile}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Inquiry Date</span>
              <span className={styles.value}>
                {new Date(selectedInquiry.createdAt).toLocaleString()}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Message</span>
              <div className={styles.messageValue}>{selectedInquiry.message}</div>
            </div>

            <div className={styles.statusSection}>
              <span className={styles.label}>Change Status</span>
              <select
                className={styles.statusSelect}
                value={selectedInquiry.status}
                onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value)}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className={styles.bulkDeleteBtn}
                style={{ fontSize: "0.85rem", padding: "6px 12px" }}
                onClick={() => handleDeleteSingle(selectedInquiry._id)}
              >
                <Trash2 size={14} /> Delete Inquiry
              </button>
            </div>
          </div>
        )}
      </Modal>

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
