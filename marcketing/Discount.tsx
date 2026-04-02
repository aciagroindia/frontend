"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Pencil, Trash2, Plus, Search, X } from "lucide-react";
import { toast } from "react-hot-toast";
import styles from "./Discounts.module.css";
import { fetchDiscounts, createDiscount, updateDiscount, deleteDiscount, Discount } from "../../lib/discountApi";
import { useDebounce } from "../../lib/useDebounce";
import ConfirmationModal from "../signUP/ConfirmationModal";


interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (discount: Discount | Omit<Discount, 'id'>) => void;
  initialData?: Discount | null;
}

const DiscountModal = ({ isOpen, onClose, onSubmit, initialData }: DiscountModalProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<Discount['type']>("Percentage");
  const [value, setValue] = useState("");
  const [products, setProducts] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "");
      setType(initialData?.type || "Percentage");
      setValue(initialData?.value || "");
      setProducts(initialData?.products.toString() || "");
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Discount Name is required.");
      return;
    }
    if (!value.trim()) {
      toast.error("Value is required.");
      return;
    }
    if (!products || Number(products) < 0) {
      toast.error("Applicable Products must be a valid number.");
      return;
    }

    const discountData = { name, type, value, products: Number(products) };
    if (initialData?.id) {
      onSubmit({ id: initialData.id, ...discountData });
    } else {
      onSubmit(discountData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{initialData?.id ? "Edit Discount" : "Create New Discount"}</h2>
          <button onClick={onClose} className={styles.modalCloseButton}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}><label htmlFor="name">Discount Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className={styles.formGroup}>
            <label htmlFor="type">Discount Type</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as Discount['type'])}>
              <option value="Percentage">Percentage</option>
              <option value="Fixed Amount">Fixed Amount</option>
              <option value="Shipping">Shipping</option>
              <option value="BOGO">BOGO</option>
            </select>
          </div>
          <div className={styles.formGroup}><label htmlFor="value">Value</label><input type="text" id="value" value={value} onChange={(e) => setValue(e.target.value)} /></div>
          <div className={styles.formGroup}><label htmlFor="products">Applicable Products</label><input type="number" id="products" value={products} onChange={(e) => setProducts(e.target.value)} /></div>
          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.secondaryButton}>Cancel</button>
            <button type="submit" className={styles.primaryButton}>{initialData?.id ? "Save Changes" : "Create Discount"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState<Discount | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        setLoading(true);
        const data = await fetchDiscounts();
        setDiscounts(data);
      } catch (err) {
        setError("Failed to load discounts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDiscounts();
  }, []);

  useEffect(() => {
    const result = discounts.filter(discount =>
      discount.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredDiscounts(result);
  }, [discounts, debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenMenuId(null);
    };
    const handleScroll = () => setOpenMenuId(null);

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [openMenuId]);

  const handleModalSubmit = async (discountData: Discount | Omit<Discount, 'id'>) => {
    setIsMutating(true);
    setError(null);
    try {
      if ('id' in discountData) {
        const updated = await updateDiscount(discountData.id, discountData);
        setDiscounts(prev => prev.map(d => d.id === updated.id ? updated : d));
        toast.success("Discount updated successfully!");
      } else {
        const newDiscount = await createDiscount(discountData);
        setDiscounts(prev => [...prev, newDiscount]);
        toast.success("Discount created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = "Failed to save discount.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDiscountToDelete(id);
    setIsConfirmModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!discountToDelete) return;

    setIsConfirmModalOpen(false);
    setIsMutating(true);
    setError(null);
    try {
      await deleteDiscount(discountToDelete);
      setDiscounts(prev => prev.filter(d => d.id !== discountToDelete));
      toast.success("Discount deleted successfully!");
    } catch (err) {
      const errorMessage = "Failed to delete discount.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsMutating(false);
      setDiscountToDelete(null);
    }
  };

  const openCreateModal = () => {
    setCurrentDiscount(null);
    setIsModalOpen(true);
  };

  const openEditModal = (discount: Discount) => {
    setCurrentDiscount(discount);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleOpenMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const DROPDOWN_WIDTH = 120; // from CSS
    setMenuPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.right + window.scrollX - DROPDOWN_WIDTH,
    });
    setOpenMenuId(openMenuId === id ? null : id);
  };

  if (loading) {
    return <div className={styles.container}>Loading discounts...</div>;
  }

  if (error) {
    return <div className={styles.container}><div className={styles.error}>Error: {error}</div></div>;
  }

  return (
    <div className={`${styles.container} ${isMutating ? styles.disabled : ''}`}>
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input type="text" placeholder="Search discounts..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button className={styles.addButton} onClick={openCreateModal}>
          <Plus size={18} />
          Add Discount
        </button>
      </div>

      {filteredDiscounts.length === 0 ? (
        <div className={styles.noData}>No discounts found.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Value</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.map((discount) => (
                <tr key={discount.id}>
                  <td className={styles.discountName}>{discount.name}</td>
                  <td>{discount.type}</td>
                  <td>{discount.value}</td>
                  <td>{discount.products} products</td>
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.actionButton}
                      title="More options"
                      onClick={(e) => handleOpenMenu(e, discount.id)}
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openMenuId && createPortal(
        <div
          className={styles.actionsDropdown}
          ref={menuRef}
          style={{
            position: 'absolute',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            zIndex: 1000
          }}
        >
          <button className={styles.dropdownItem} onClick={() => {
            const discount = discounts.find(d => d.id === openMenuId);
            if (discount) openEditModal(discount);
          }}>
            <Pencil size={16} />
            <span>Edit</span>
          </button>
          <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={() => handleDeleteClick(openMenuId)}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>,
        document.body
      )}

      <DiscountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={currentDiscount}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this discount? This action cannot be undone."
      />
    </div>
  );
}
