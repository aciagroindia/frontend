"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Pencil, Trash2, Plus, Search, X } from "lucide-react";
import styles from "./Coupons.module.css";
import { toast } from "react-hot-toast";
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon, Coupon } from "../../lib/couponApi"; // Import API functions

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coupon: Coupon | Omit<Coupon, 'id'>) => void;
  initialData?: Coupon | null;
}

// A simple debounce hook for the search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const CouponModal = ({ isOpen, onClose, onSubmit, initialData }: CouponModalProps) => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCode(initialData?.code || "");
      setDiscount(initialData?.discount || "");
      setUsageLimit(initialData?.usageLimit || "");
      // Format date for input type="date" which expects "YYYY-MM-DD"
      const formattedDate = initialData?.expiryDate
        ? new Date(initialData.expiryDate).toISOString().split('T')[0]
        : "";
      setExpiryDate(formattedDate);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const couponData = { code, discount, usageLimit, expiryDate };
    if (initialData?.id) {
      onSubmit({ id: initialData.id, ...couponData });
    } else {
      onSubmit(couponData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{initialData?.id ? "Edit Coupon" : "Create New Coupon"}</h2>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="code">Coupon Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="discount">Discount</label>
            <input
              type="text"
              id="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="usageLimit">Usage Limit</label>
            <input
              type="text"
              id="usageLimit"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="date"
              id="expiryDate"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton}>
              {initialData?.id ? "Save Changes" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent} style={{ maxWidth: '450px' }}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.modalCloseButton}><X size={20} /></button>
        </div>
        <div className={styles.modalForm} style={{ paddingBottom: '1rem' }}>
          <p style={{ margin: 0, lineHeight: 1.5, color: '#495057' }}>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button type="button" onClick={onClose} className={styles.secondaryButton}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={`${styles.primaryButton} ${styles.danger}`}>
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default function CouponTable() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        setLoading(true);
        const data = await fetchCoupons();
        setCoupons(data);
      } catch (err) {
        setError("Failed to load coupons.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCoupons();
  }, []);

  useEffect(() => {
    const result = coupons.filter(coupon =>
      coupon.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      coupon.discount.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredCoupons(result);
  }, [coupons, debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleModalSubmit = async (couponData: Coupon | Omit<Coupon, 'id'>) => {
    setIsMutating(true);
    setError(null);
    try {
      if ('id' in couponData) {
        // Update
        const updatedCoupon = await updateCoupon(couponData.id, couponData);
        setCoupons((prev) =>
          prev.map((c) => (c.id === updatedCoupon.id ? updatedCoupon : c))
        );
        toast.success("Coupon updated successfully!");
      } else {
        // Create
        const newCoupon = await createCoupon(couponData);
        setCoupons((prev) => [...prev, newCoupon]);
        toast.success("Coupon created successfully!");
      }
    } catch (err) {
      const errorMessage = "Failed to save coupon.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setCouponToDelete(id);
    setIsConfirmModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!couponToDelete) return;

    setIsConfirmModalOpen(false);
    setIsMutating(true);
    setError(null);
    try {
      await deleteCoupon(couponToDelete);
      setCoupons((prev) => prev.filter((c) => c.id !== couponToDelete));
      toast.success("Coupon deleted successfully!");
    } catch (err) {
      const errorMessage = "Failed to delete coupon.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsMutating(false);
      setCouponToDelete(null);
    }
  };

  const openCreateModal = () => {
    setCurrentCoupon(null);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setCurrentCoupon(coupon);
    setIsModalOpen(true);
    setOpenMenuId(null); // Close dropdown after opening modal
  };

  if (loading) {
    return <div className={styles.loading}>Loading coupons...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={`${styles.tableContainer} ${isMutating ? styles.disabled : ''}`}>
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search coupons..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={openCreateModal} className={styles.addButton}>
          <Plus size={18} />
          Create Coupon
        </button>
      </div>

      {filteredCoupons.length === 0 ? (
        <div className={styles.noData}>No coupons found.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Usage / Limit</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>
                  <span className={styles.couponCode}>{coupon.code}</span>
                </td>
                <td>{coupon.discount}</td>
                <td>{coupon.usageLimit}</td>
                <td>{coupon.expiryDate}</td>
                <td className={styles.actionsCell}>
                  <button
                    className={styles.actionButton}
                    title="More options"
                    onClick={() => setOpenMenuId(openMenuId === coupon.id ? null : coupon.id)}
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  {openMenuId === coupon.id && (
                    <div className={styles.actionsDropdown} ref={menuRef}>
                      <button className={styles.dropdownItem} onClick={() => openEditModal(coupon)}>
                        <Pencil size={16} />
                        <span>Edit</span>
                      </button>
                      <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={() => handleDeleteClick(coupon.id)}>
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination (Placeholder) */}
      <div className={styles.pagination}>
        {/* <button>Previous</button> */}
        {/* <span>Page 1 of 1</span> */}
        {/* <button>Next</button> */}
      </div>

      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={currentCoupon}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this coupon? This action cannot be undone."
      />
    </div>
  );
}
