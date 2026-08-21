"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Pencil, Trash2, Plus, Search, X, CheckCircle, XCircle } from "lucide-react";
import styles from "./Coupons.module.css";
import { toast } from "react-hot-toast";
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon, Coupon } from "../../lib/couponApi";
import ConfirmationModal from "../signUP/ConfirmationModal";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coupon: Coupon | Omit<Coupon, 'id'>) => void;
  initialData?: Coupon | null;
}

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
  const [discountType, setDiscountType] = useState<Coupon['discountType']>("Percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [usageLimit, setUsageLimit] = useState("100");
  const [userUsageLimit, setUserUsageLimit] = useState("1");
  const [expiryDate, setExpiryDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setCode(initialData?.code || "");
      setDiscountType(initialData?.discountType || "Percentage");
      setDiscountValue(initialData?.discountValue !== undefined ? initialData.discountValue.toString() : "");
      setMinOrderAmount(initialData?.minOrderAmount ? initialData.minOrderAmount.toString() : "");
      setMaxDiscountAmount(initialData?.maxDiscountAmount ? initialData.maxDiscountAmount.toString() : "");
      setUsageLimit(initialData?.usageLimit !== undefined ? initialData.usageLimit.toString() : "100");
      setUserUsageLimit(initialData?.userUsageLimit !== undefined ? initialData.userUsageLimit.toString() : "1");
      setExpiryDate(initialData?.expiryDate || "");
      setIsActive(initialData?.isActive !== false);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Coupon Code is required.");
      return;
    }
    if (!discountValue.trim() || isNaN(Number(discountValue)) || Number(discountValue) <= 0) {
      toast.error("Valid discount value is required.");
      return;
    }
    if (discountType === "Percentage" && Number(discountValue) > 100) {
      toast.error("Percentage discount cannot exceed 100%.");
      return;
    }

    const couponData: any = {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : 100,
      userUsageLimit: userUsageLimit ? Number(userUsageLimit) : 1,
      expiryDate: expiryDate || null,
      isActive,
    };

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
      <div className={styles.modalContent} style={{ maxWidth: '540px' }}>
        <div className={styles.modalHeader}>
          <h2>{initialData?.id ? "Edit Promo Coupon" : "Create New Coupon"}</h2>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="code">Coupon Code *</label>
            <input
              type="text"
              id="code"
              placeholder="e.g. SAVE20, FESTIVE100"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label htmlFor="discountType">Discount Type *</label>
              <select
                id="discountType"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as Coupon['discountType'])}
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="FixedAmount">Fixed Amount (₹)</option>
              </select>
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label htmlFor="discountValue">
                {discountType === "Percentage" ? "Discount Value (%) *" : "Discount Value (₹) *"}
              </label>
              <input
                type="number"
                id="discountValue"
                placeholder={discountType === "Percentage" ? "20" : "150"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label htmlFor="minOrderAmount">Min Order Subtotal (₹)</label>
              <input
                type="number"
                id="minOrderAmount"
                placeholder="0 (No minimum)"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                min="0"
              />
            </div>
            {discountType === "Percentage" && (
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="maxDiscountAmount">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  id="maxDiscountAmount"
                  placeholder="Optional Limit (e.g. 300)"
                  value={maxDiscountAmount}
                  onChange={(e) => setMaxDiscountAmount(e.target.value)}
                  min="1"
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label htmlFor="usageLimit">Total Global Usage Limit</label>
              <input
                type="number"
                id="usageLimit"
                placeholder="100"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                min="1"
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label htmlFor="userUsageLimit">Per-Customer Usage Limit</label>
              <input
                type="number"
                id="userUsageLimit"
                placeholder="1"
                value={userUsageLimit}
                onChange={(e) => setUserUsageLimit(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="expiryDate">Expiry Date (Optional)</label>
            <input
              type="date"
              id="expiryDate"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="isActiveCoupon"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="isActiveCoupon" style={{ cursor: 'pointer', marginBottom: 0, fontWeight: 500 }}>
              Enable this coupon (Active)
            </label>
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
    const result = coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        c.discountValue?.toString().includes(debouncedSearchTerm)
    );
    setFilteredCoupons(result);
  }, [coupons, debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleModalSubmit = async (couponData: Coupon | Omit<Coupon, 'id'>) => {
    setIsMutating(true);
    setError(null);
    try {
      if ('id' in couponData) {
        const updated = await updateCoupon(couponData.id, couponData);
        setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        toast.success("Coupon updated successfully!");
      } else {
        const newCoupon = await createCoupon(couponData);
        setCoupons((prev) => [newCoupon, ...prev]);
        toast.success("Coupon created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to save coupon.";
      toast.error(msg);
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
    } catch (err: any) {
      toast.error("Failed to delete coupon.");
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
    setOpenMenuId(null);
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
            placeholder="Search coupons by code..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={openCreateModal} className={styles.addButton}>
          <Plus size={18} />
          Create Promo Coupon
        </button>
      </div>

      {filteredCoupons.length === 0 ? (
        <div className={styles.noData}>No coupons found. Click "Create Promo Coupon" to add one.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Discount</th>
              <th>Conditions</th>
              <th>Usage Stats</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>
                  <span className={styles.couponCode} style={{ background: '#f3f4f6', border: '1px dashed #6b7280', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    {coupon.code}
                  </span>
                </td>
                <td>
                  <strong>
                    {coupon.discountType === "Percentage"
                      ? `${coupon.discountValue}% Off`
                      : `₹${coupon.discountValue} Flat Off`}
                  </strong>
                  {coupon.maxDiscountAmount ? (
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block' }}>
                      (Max ₹{coupon.maxDiscountAmount})
                    </span>
                  ) : null}
                </td>
                <td>
                  {coupon.minOrderAmount && coupon.minOrderAmount > 0 ? (
                    <span style={{ fontSize: '0.85rem', color: '#92400e', background: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>
                      Min ₹{coupon.minOrderAmount}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>No minimum</span>
                  )}
                </td>
                <td>
                  <span style={{ fontSize: '0.9rem' }}>
                    <strong>{coupon.usageCount || 0}</strong> / {coupon.usageLimit || '∞'} uses
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block' }}>
                    ({coupon.userUsageLimit || 1} per user)
                  </span>
                </td>
                <td>
                  {coupon.expiryDate ? (
                    <span style={{ fontSize: '0.85rem' }}>{coupon.expiryDate}</span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Never</span>
                  )}
                </td>
                <td>
                  {coupon.isActive ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: 600, fontSize: '0.85rem' }}>
                      <CheckCircle size={14} /> Active
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#9ca3af', fontWeight: 500, fontSize: '0.85rem' }}>
                      <XCircle size={14} /> Inactive
                    </span>
                  )}
                </td>
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
