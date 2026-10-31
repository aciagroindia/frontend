"use client";

import { useState, useEffect, useMemo } from "react";
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

type DateFilter = "all" | "today" | "7days" | "30days" | "custom";

export default function BulkInquiryPage() {
  const [inquiries, setInquiries] = useState<BulkInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] =
    useState<BulkInquiry | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  // FILTER ENQUIRIES
  const filteredInquiries = useMemo(() => {
    const term = search.trim().toLowerCase();
    const now = new Date();

    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    if (dateFilter === "today") {
      fromDate = new Date(now);
      fromDate.setHours(0, 0, 0, 0);
    }

    if (dateFilter === "7days") {
      fromDate = new Date(now);
      fromDate.setDate(fromDate.getDate() - 6);
      fromDate.setHours(0, 0, 0, 0);
    }

    if (dateFilter === "30days") {
      fromDate = new Date(now);
      fromDate.setDate(fromDate.getDate() - 29);
      fromDate.setHours(0, 0, 0, 0);
    }

    if (dateFilter === "custom") {
      if (startDate) {
        fromDate = new Date(`${startDate}T00:00:00`);
      }

      if (endDate) {
        toDate = new Date(`${endDate}T23:59:59.999`);
      }
    }

    return inquiries.filter((item) => {
      const searchableText = [
        item.firstName,
        item.companyName,
        item.email,
        item.phone,
        item.productRequired,
        item.quantity,
        item.packagingSize,
        item.packagingType,
        item.manufacturingRequirement,
        item.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !term || searchableText.includes(term);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const inquiryDate = new Date(item.createdAt);

      const matchesDate =
        (!fromDate || inquiryDate >= fromDate) &&
        (!toDate || inquiryDate <= toDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [inquiries, search, statusFilter, dateFilter, startDate, endDate]);

  // EXPORT ONLY FILTERED ENQUIRIES
  const exportToCSV = () => {
    if (filteredInquiries.length === 0) {
      toast.error("No enquiries available to export.");
      return;
    }

    const headers = [
      "Inquiry Date",
      "Contact Person",
      "Company / Brand",
      "Business Email",
      "Mobile",
      "Product Required",
      "Quantity",
      "Packaging Size",
      "Packaging Type",
      "Manufacturing Requirement",
      "Additional Details",
      "Status",
    ];

    const safeValue = (value: unknown) => {
      let text = String(value ?? "");

      // Prevent spreadsheet formula execution
      if (/^[\s]*[=+\-@]/.test(text)) {
        text = "'" + text;
      }

      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = filteredInquiries.map((item) => [
      item.createdAt
        ? new Date(item.createdAt).toLocaleString("en-IN")
        : "",
      item.firstName,
      item.companyName,
      item.email,
      item.phone,
      item.productRequired,
      item.quantity,
      item.packagingSize,
      item.packagingType,
      item.manufacturingRequirement,
      item.message,
      item.status,
    ]);

    const csvContent = [
      headers.map(safeValue).join(","),
      ...rows.map((row) => row.map(safeValue).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `ACI-B2B-Enquiries-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${filteredInquiries.length} enquiries exported successfully.`);
  };

  // UPDATE STATUS
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

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateFilter("all");
    setStartDate("");
    setEndDate("");
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

      {/* SEARCH AND FILTER SECTION */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          alignItems: "end",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "7px", fontWeight: 600 }}>
            Search Enquiries
          </label>
          <input
            type="search"
            placeholder="Name, company, mobile, product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={filterInputStyle}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "7px", fontWeight: 600 }}>
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={filterInputStyle}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "7px", fontWeight: 600 }}>
            Filter by Date
          </label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            style={filterInputStyle}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </div>

        {dateFilter === "custom" && (
          <>
            <div>
              <label style={{ display: "block", marginBottom: "7px", fontWeight: 600 }}>
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                style={filterInputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "7px", fontWeight: 600 }}>
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                style={filterInputStyle}
              />
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className={styles.viewBtn}
            onClick={resetFilters}
          >
            Reset Filters
          </button>

          <button
            type="button"
            className={styles.viewBtn}
            onClick={exportToCSV}
            disabled={filteredInquiries.length === 0}
            style={{
              background: "#155b38",
              color: "#ffffff",
              border: "none",
            }}
          >
            Export CSV ({filteredInquiries.length})
          </button>
        </div>

        <div style={{ gridColumn: "1 / -1", color: "#64748b", fontSize: "13px" }}>
          Showing {filteredInquiries.length} of {inquiries.length} enquiries.
          Export will include only the enquiries currently shown after filtering.
        </div>
      </div>

      {/* ENQUIRIES TABLE */}
      <div className={styles.tableCard}>
        {loading ? (
          <p>Loading B2B enquiries...</p>
        ) : (
          <AdvancedTable
            columns={columns}
            data={filteredInquiries}
          />
        )}
      </div>

      {/* ENQUIRY DETAILS MODAL */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="B2B Enquiry Details"
      >
        {selectedInquiry && (
          <div className={styles.modalContent}>
            {[
              ["Contact Person", selectedInquiry.firstName],
              ["Company / Brand Name", selectedInquiry.companyName],
              ["Business Email", selectedInquiry.email],
              ["Mobile", selectedInquiry.phone],
              ["Product Required", selectedInquiry.productRequired],
              ["Quantity Required", selectedInquiry.quantity],
              ["Packaging Size", selectedInquiry.packagingSize],
              ["Packaging Type", selectedInquiry.packagingType],
              ["Manufacturing Requirement", selectedInquiry.manufacturingRequirement],
              [
                "Inquiry Date",
                selectedInquiry.createdAt
                  ? new Date(selectedInquiry.createdAt).toLocaleString("en-IN")
                  : "-",
              ],
            ].map(([label, value]) => (
              <div className={styles.detailRow} key={label}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{value || "-"}</span>
              </div>
            ))}

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

const filterInputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "42px",
  padding: "9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  background: "#ffffff",
  color: "#1f2937",
  outline: "none",
};
