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
  firstName: string;
  companyName: string;
  email: string;
  phone: string;
  productRequired: string;
  quantity: string;
  packagingSize: string;
  packagingType: string;
  manufacturingRequirement: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export default function BulkInquiryPage() {
  const [inquiries, setInquiries] = useState<BulkInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] =
    useState<BulkInquiry | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/bulk-orders");

      if (res.data.success) {
        setInquiries(res.data.data || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch bulk orders:", error);
      toast.error(
        error.response?.data?.message || "Failed to load B2B enquiries"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: BulkInquiry["status"]
  ) => {
    try {
      const res = await axiosInstance.put(`/bulk-orders/${id}`, {
        status: newStatus,
      });

      if (res.data.success) {
        toast.success("Enquiry status updated successfully");

        setInquiries((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );

        setSelectedInquiry((prev) =>
          prev?._id === id ? { ...prev, status: newStatus } : prev
        );
      }
    } catch (error: any) {
      console.error("Status update failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to update status"
      );
    }
  };

  const columns = [
    {
      key: "createdAt",
      label: "Date",
      render: (val: string) =>
        val ? new Date(val).toLocaleDateString("en-IN") : "-",
    },
    {
      key: "firstName",
      label: "Contact Person",
    },
    {
      key: "companyName",
      label: "Company / Brand",
    },
    {
      key: "phone",
      label: "Mobile",
    },
    {
      key: "productRequired",
      label: "Product",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "status",
      label: "Status",
      render: (val: string) => (
        <span
          className={`${styles.statusBadge} ${styles[val?.toLowerCase()] || ""}`}
        >
          {val ? val.charAt(0).toUpperCase() + val.slice(1) : "New"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: any, row: BulkInquiry) => (
        <div className={styles.tableActions}>
          <button
            type="button"
            className={styles.viewBtn}
            onClick={() => setSelectedInquiry(row)}
          >
            View Details
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
          <p className={styles.subtitle}>
            Manage B2B enquiries, bulk supply and contract manufacturing requests.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.viewBtn}
            onClick={fetchInquiries}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Enquiries"}
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <p>Loading B2B enquiries...</p>
        ) : (
          <AdvancedTable columns={columns} data={inquiries} />
        )}
      </div>

      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="B2B Enquiry Details"
      >
        {selectedInquiry && (
          <div className={styles.modalContent}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Contact Person</span>
              <span className={styles.value}>
                {selectedInquiry.firstName || "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Company / Brand Name</span>
              <span className={styles.value}>
                {selectedInquiry.companyName || "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Business Email</span>
              <span className={styles.value}>
                {selectedInquiry.email || "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Mobile</span>
              <span className={styles.value}>
                {selectedInquiry.phone || "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Product Required</span>
              <span className={styles.value}>
                {selectedInquiry.productRequired || "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Quantity Required</span>
              <span className={styles.value}>
                {selectedInquiry.quantity || "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Packaging Size</span>
              <span className={styles.value}>
                {selectedInquiry.packagingSize || "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Packaging Type</span>
              <span className={styles.value}>
                {selectedInquiry.packagingType || "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Manufacturing Requirement</span>
              <span className={styles.value}>
                {selectedInquiry.manufacturingRequirement || "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Inquiry Date</span>
              <span className={styles.value}>
                {selectedInquiry.createdAt
                  ? new Date(selectedInquiry.createdAt).toLocaleString("en-IN")
                  : "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Additional Details</span>
              <div className={styles.messageValue}>
                {selectedInquiry.message || "No additional details provided."}
              </div>
            </div>

            <div className={styles.statusSection}>
              <span className={styles.label}>Change Enquiry Status</span>

              <select
                className={styles.statusSelect}
                value={selectedInquiry.status}
                onChange={(e) =>
                  handleStatusChange(
                    selectedInquiry._id,
                    e.target.value as BulkInquiry["status"]
                  )
                }
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
