"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import AdvancedTable from "../../../../components/admin-ui/AdvancedTable";
import Modal from "../../../../components/admin-ui/Modal";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await axiosInstance.patch(`/admin/inquiries/${id}`, {
        status: newStatus,
      });
      if (res.data.success) {
        toast.success("Status updated");
        // Update local state
        setInquiries((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus as any } : item))
        );
        if (selectedInquiry?._id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const columns = [
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
      render: (_: any, row: BulkInquiry) => (
        <button className={styles.viewBtn} onClick={() => setSelectedInquiry(row)}>
          View
        </button>
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
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
