"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import AdvancedTable from "../../../../components/admin-ui/AdvancedTable";
import axiosInstance from "@/utils/axiosInstance"; 
import styles from "./OrdersPage.module.css";
import { toast } from "react-hot-toast";
import { Trash2, Sparkles, AlertCircle } from "lucide-react";
import ConfirmationModal from "../../../../components/signUP/ConfirmationModal";

interface Order {
  id: string;
  _id: string;
  order?: string;
  customer: any;
  amount: number | string;
  totalAmount?: number | string;
  orderStatus: string;
  trackingId?: string;
  courierName?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/admin/orders"); 
      if (response.data.success) {
        setOrders(response.data.data || response.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelledCount = orders.filter(
    (o) => (o.orderStatus || "").toLowerCase() === "cancelled"
  ).length;

  const handleDeleteSingle = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalConfig({
      isOpen: true,
      title: "Delete Order",
      message: "Are you sure you want to delete this order record? This action cannot be undone.",
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          const res = await axiosInstance.delete(`/admin/orders/${orderId}`);
          if (res.data.success) {
            toast.success("Order deleted successfully");
            setOrders((prev) => prev.filter((o) => (o._id || o.id) !== orderId));
            setSelectedIds((prev) => prev.filter((id) => id !== orderId));
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to delete order");
        }
      },
    });
  };

  const handleCleanCancelled = () => {
    if (cancelledCount === 0) {
      toast.success("No cancelled orders found to clean!");
      return;
    }

    setModalConfig({
      isOpen: true,
      title: "Clean Cancelled Orders",
      message: `Are you sure you want to permanently delete all ${cancelledCount} cancelled orders?`,
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          setCleaning(true);
          const res = await axiosInstance.delete("/admin/orders/cleanup/cancelled");
          if (res.data.success) {
            toast.success(res.data.message || "Cancelled orders cleaned up successfully!");
            setOrders((prev) =>
              prev.filter((o) => (o.orderStatus || "").toLowerCase() !== "cancelled")
            );
            setSelectedIds([]);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to clean cancelled orders");
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
      title: "Delete Selected Orders",
      message: `Are you sure you want to delete ${selectedIds.length} selected orders? This action cannot be undone.`,
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          setCleaning(true);
          const res = await axiosInstance.post("/admin/orders/bulk-delete", {
            ids: selectedIds,
          });
          if (res.data.success) {
            toast.success(res.data.message || "Selected orders deleted successfully");
            setOrders((prev) =>
              prev.filter((o) => !selectedIds.includes(o._id || o.id))
            );
            setSelectedIds([]);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to delete selected orders");
        } finally {
          setCleaning(false);
        }
      },
    });
  };

  const toggleSelectRow = (orderId: string) => {
    setSelectedIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o) => o._id || o.id));
    }
  };

  const columns = [
    {
      key: "select",
      sortable: false,
      label: (
        <input
          type="checkbox"
          checked={orders.length > 0 && selectedIds.length === orders.length}
          onChange={toggleSelectAll}
          title="Select All"
          style={{ cursor: "pointer" }}
        />
      ),
      render: (_: any, row: Order) => {
        const id = row._id || row.id;
        return (
          <input
            type="checkbox"
            checked={selectedIds.includes(id)}
            onChange={() => toggleSelectRow(id)}
            style={{ cursor: "pointer" }}
          />
        );
      },
    },
    { 
      key: "id", 
      label: "Order ID", 
      render: (val: string, row: Order) => {
        const displayId = val || row._id || '';
        return (
          <span 
            title={displayId} 
            style={{ fontSize: '0.85rem', cursor: 'help', fontFamily: 'monospace' }}
          >
            #{displayId.slice(0, 8)}...
          </span>
        );
      }
    },
    { 
      key: "customer", 
      label: "Customer",
      render: (val: any, row: Order) => {
        if (row.customer && typeof row.customer === 'object') {
          return row.customer.name || "N/A";
        }
        return row.customer || "N/A";
      }
    },
    { 
      key: "amount", 
      label: "Amount", 
      render: (val: any, row: Order) => {
        const displayAmount = val || row.totalAmount;
        if (typeof displayAmount === 'string' && displayAmount.startsWith('₹')) return displayAmount;
        return `₹${Number(displayAmount || 0).toLocaleString()}`;
      }
    },
    {
      key: "status",
      label: "Status",
      render: (_: any, row: Order) => {
        const currentStatus = (row.orderStatus || 'pending').toLowerCase();

        const statusConfig: { [key:string]: {text: string, className: string} } = {
          'created': { text: 'Pending', className: styles.pending },
          'pending': { text: 'Pending', className: styles.pending },
          'processing': { text: 'Processing', className: styles.confirmed },
          'confirmed': { text: 'Confirmed', className: styles.confirmed },
          'shipped': { text: 'Shipped', className: styles.shipped },
          'out for delivery': { text: 'Out for Delivery', className: styles.outfordelivery },
          'delivered': { text: 'Delivered', className: styles.delivered },
          'cancelled': { text: 'Cancelled', className: styles.cancelled },
        };

        const config = statusConfig[currentStatus] || { text: currentStatus, className: styles.pending };
        const displayText = config.text.charAt(0).toUpperCase() + config.text.slice(1);

        return (
          <span className={`${styles.badge} ${config.className}`}>
            {displayText}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: any, row: Order) => {
        const orderId = row._id || row.id;
        return (
          <div className={styles.actions}>
            <button
              className={styles.viewBtn}
              onClick={() => router.push(`/admin/orders/${orderId}`)}
            >
              View
            </button>
            <button
              className={styles.deleteBtn}
              onClick={(e) => handleDeleteSingle(orderId, e)}
              title="Delete Order Record"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      }
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.card} style={{ padding: "24px" }}>
          Loading orders...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Orders Management</h1>
          <p className={styles.subtitle}>Manage and track your store orders</p>
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
            className={styles.cleanCancelledBtn}
            onClick={handleCleanCancelled}
            disabled={cleaning || cancelledCount === 0}
            title="Clean all cancelled orders from table"
          >
            <Sparkles size={16} />
            Clean Cancelled Orders ({cancelledCount})
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <AdvancedTable columns={columns} data={orders} />
      </div>

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