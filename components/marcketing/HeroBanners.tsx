"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2, Plus, Search, X, Upload } from "lucide-react";
import styles from "./HeroBanners.module.css";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import { useDebounce } from "../../lib/useDebounce";
import ConfirmationModal from "../signUP/ConfirmationModal";

// API functions ko directly yahan use karenge.
// Banner type ko yahan define kar lete hain.
export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  order: number;
  status: "Active" | "Inactive";
}

// Helper to map backend's `_id` to frontend's `id`.
const normalizeBanner = (banner: any): Banner => ({
  ...banner,
  id: banner._id || banner.id,
});

type BannerFormPayload = {
  id?: string;
  title: string;
  imageUrl: File | string | null | undefined;
  link?: string;
  order: string | number;
  status: "Active" | "Inactive";
};

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bannerData: BannerFormPayload) => void;
  initialData?: Banner | null;
  isMutating?: boolean;
  maxOrder: number;
}

const BannerModal = ({ isOpen, onClose, onSubmit, initialData, isMutating = false, maxOrder }: BannerModalProps) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setLink(initialData?.link || "");
      setImagePreview(initialData?.imageUrl || null);
      setOrder(initialData?.order !== undefined ? initialData.order.toString() : String(maxOrder || 1));
      setStatus(initialData?.status || "Active");
      setImageFile(null); // Reset file on open
    }
  }, [isOpen, initialData, maxOrder]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Create a temporary local URL for preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      setOrder("");
      return;
    }
    let num = parseInt(raw, 10);
    if (num < 1) num = 1;
    if (num > maxOrder) num = maxOrder;
    setOrder(String(num));
  };

  const handleOrderBlur = () => {
    if (!order || Number(order) < 1) {
      setOrder("1");
    } else if (Number(order) > maxOrder) {
      setOrder(String(maxOrder));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isMutating) return;
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!initialData && !imageFile) {
      toast.error("An image is required for a new banner.");
      return;
    }
    let orderNum = Number(order);
    if (!order || isNaN(orderNum) || orderNum < 1 || orderNum > maxOrder) {
      orderNum = Math.min(Math.max(orderNum || 1, 1), maxOrder);
    }
    // Pass the new file if it exists, otherwise pass the original image URL
    const bannerData: BannerFormPayload = { 
      title: title.trim(), 
      imageUrl: imageFile || initialData?.imageUrl, 
      link: link.trim(),
      order: orderNum, 
      status 
    };
    if (initialData?.id) {
      onSubmit({ id: initialData.id, ...bannerData });
    } else {
      onSubmit(bannerData);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{initialData?.id ? "Edit Banner" : "Create New Banner"}</h2>
          <button onClick={onClose} disabled={isMutating} className={styles.modalCloseButton}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isMutating} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="link">Link / URL (Optional)</label>
            <input 
              type="text" 
              id="link" 
              placeholder="e.g. /products, /collections/category or https://... (Leave blank for no action)" 
              value={link} 
              onChange={(e) => setLink(e.target.value)} 
              disabled={isMutating} 
            />
          </div>

          <div className={styles.formGroup}>
            <label>Image</label>
            <div className={styles.fileInputContainer}>
              <label htmlFor="image" className={`${styles.fileInputLabel} ${isMutating ? styles.disabled : ''}`}>
                <Upload size={16} />
                <span>Choose File</span>
              </label>
              <input type="file" id="image" accept="image/*" onChange={handleImageChange} disabled={isMutating} className={styles.fileInput} />
              {imageFile && <span className={styles.fileName}>{imageFile.name}</span>}
              {!imageFile && initialData?.imageUrl && <span className={styles.fileName}>Current image is set</span>}
            </div>
            {imagePreview && (
              <div className={styles.imagePreviewWrapper}>
                <Image src={imagePreview} alt="Banner preview" width={150} height={50} className={styles.bannerImage} />
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="order">Display Order (Max: {maxOrder})</label>
            <input 
              type="number" 
              id="order" 
              min={1} 
              max={maxOrder} 
              placeholder={`1 to ${maxOrder}`}
              value={order} 
              onChange={handleOrderChange}
              onBlur={handleOrderBlur}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              disabled={isMutating} 
            />
            <small style={{ color: "#777", fontSize: "12px", marginTop: "4px", display: "block" }}>
              Total banners ke hisab se order 1 se {maxOrder} tak hi rakha ja sakta hai.
            </small>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")} disabled={isMutating}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} disabled={isMutating} className={styles.secondaryButton}>Cancel</button>
            <button type="submit" disabled={isMutating} className={styles.primaryButton}>
              {isMutating ? "Saving..." : initialData?.id ? "Save Changes" : "Create Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default function HeroBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const DROPDOWN_WIDTH = 130; // From .actionsDropdown width in CSS
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<any[]>("/banners");
        // Map `_id` to `id` for each banner and then sort.
        const mappedBanners = response.data.map(normalizeBanner);
        setBanners(mappedBanners.sort((a, b) => a.order - b.order));
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load banners.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    const result = banners.filter(banner =>
      banner.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredBanners(result);
  }, [banners, debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenMenuId(null);
    };
    const handleScroll = () => setOpenMenuId(null);
    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("wheel", handleScroll, { passive: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("wheel", handleScroll);
    };
  }, [openMenuId]);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate position to right-align the dropdown with the button
    setMenuRect({
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX - DROPDOWN_WIDTH,
    });
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleModalSubmit = async (bannerData: BannerFormPayload) => {
    if (isMutating) return;
    setIsMutating(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', (bannerData.title || '').trim());
    formData.append('order', String(bannerData.order));
    formData.append('status', bannerData.status);
    formData.append('link', (bannerData.link || '').trim());

    // Agar nayi image hai to hi append karein
    if (bannerData.imageUrl && typeof bannerData.imageUrl !== 'string') {
      formData.append('image', bannerData.imageUrl);
    }

    try {
      if (bannerData.id) {
        // Update banner
        const response = await axiosInstance.put<any>(`/banners/${bannerData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const updatedBanner = normalizeBanner(response.data);
        setBanners(prev => prev.map(b => (b.id === updatedBanner.id ? updatedBanner : b)).sort((a, b) => a.order - b.order));
        try { localStorage.removeItem('hero_banners'); } catch (_) {}
        toast.success("Banner updated successfully!");
      } else {
        // Create banner
        if (!bannerData.imageUrl) throw new Error("Image is required to create a banner.");
        const response = await axiosInstance.post<any>('/banners', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const newBanner = normalizeBanner(response.data);
        setBanners(prev => [...prev, newBanner].sort((a, b) => a.order - b.order));
        try { localStorage.removeItem('hero_banners'); } catch (_) {}
        toast.success("Banner created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save banner.");
      console.error(err);
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setBannerToDelete(id);
    setIsConfirmModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!bannerToDelete || isMutating) return;

    setIsConfirmModalOpen(false);
    setIsMutating(true);
    setError(null);
    try {
      await axiosInstance.delete(`/banners/${bannerToDelete}`);
      setBanners(prev => prev.filter(b => b.id !== bannerToDelete));
      try { localStorage.removeItem('hero_banners'); } catch (_) {}
      toast.success("Banner deleted successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete banner.");
      console.error(err);
    } finally {
      setIsMutating(false);
      setBannerToDelete(null);
    }
  };
  const openCreateModal = () => {
    setCurrentBanner(null);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setCurrentBanner(banner);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  if (loading) {
    return <div className={styles.container}>Loading banners...</div>;
  }

  if (error) {
    return <div className={styles.container}><div className={styles.error}>Error: {error}</div></div>;
  }

  const maxOrder = currentBanner ? Math.max(banners.length, 1) : banners.length + 1;

  return (
    <div className={`${styles.container} ${isMutating ? styles.disabled : ''}`}>
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input type="text" placeholder="Search banners..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button className={styles.addButton} onClick={openCreateModal}>
          <Plus size={18} /> Add Banner
        </button>
      </div>

      {filteredBanners.length === 0 ? (
        <div className={styles.noData}>No banners found.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Order</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBanners.map((banner) => (
                <tr key={banner.id}>
                  <td>
                    <div className={styles.imageWrapper}>
                      <Image src={banner.imageUrl} alt={banner.title} width={150} height={50} className={styles.bannerImage} />
                    </div>
                  </td>
                  <td>{banner.title}</td>
                  <td>{banner.order}</td>
                  <td>
                    <span className={`${styles.status} ${banner.status === 'Active' ? styles.active : styles.inactive}`}>
                      {banner.status}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <button className={styles.actionButton} aria-label="More options" onClick={(e) => toggleMenu(e, banner.id)}>
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PORTAL: Yeh table ke bahar render hota hai isliye kabhi cut nahi hoga */}
      {openMenuId !== null && menuRect && typeof document !== "undefined" &&
        createPortal(
          <div 
            className={styles.actionsDropdown} 
            ref={menuRef}
            style={{ 
              position: 'absolute', 
              top: `${menuRect.top}px`, 
              left: `${menuRect.left}px`,
              zIndex: 9999 
            }}
          >
            <button className={styles.dropdownItem} onClick={() => openEditModal(banners.find(b => b.id === openMenuId)!)}>
              <Pencil size={16} /> <span>Edit</span>
            </button>
            <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={() => handleDeleteClick(openMenuId!)}>
              <Trash2 size={16} /> <span>Delete</span>
            </button>
          </div>,
          document.body
        )
      }
      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={currentBanner}
        isMutating={isMutating}
        maxOrder={maxOrder}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this banner? This action cannot be undone."
      />
    </div>
  );
}