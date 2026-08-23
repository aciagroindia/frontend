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

export interface BulkBanner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  order: number;
  status: "Active" | "Inactive";
}

// Helper to map backend's `_id` to frontend's `id`.
const normalizeBanner = (banner: any): BulkBanner => ({
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
  initialData?: BulkBanner | null;
}

const BannerModal = ({ isOpen, onClose, onSubmit, initialData }: BannerModalProps) => {
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
      setOrder(initialData?.order?.toString() || "");
      setStatus(initialData?.status || "Active");
      setImageFile(null); // Reset file on open
    }
  }, [isOpen, initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Create a temporary local URL for preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!initialData && !imageFile) {
      toast.error("An image is required for a new banner.");
      return;
    }
    if (!order || Number(order) < 0) {
      toast.error("A valid order number is required.");
      return;
    }
    // Pass the new file if it exists, otherwise pass the original image URL
    const bannerData: BannerFormPayload = { 
      title, 
      imageUrl: imageFile || initialData?.imageUrl, 
      link,
      order, 
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
          <h2>{initialData?.id ? "Edit Bulk Banner" : "Create New Bulk Banner"}</h2>
          <button onClick={onClose} className={styles.modalCloseButton}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              placeholder="e.g. Bulk Ayurvedic Wholesale Offer" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="link">Link / Anchor (Optional)</label>
            <input 
              type="text" 
              id="link" 
              placeholder="e.g. #bulk-form or /contact" 
              value={link} 
              onChange={(e) => setLink(e.target.value)} 
            />
          </div>

          <div className={styles.formGroup}>
            <label>Banner Image</label>
            <div className={styles.fileInputContainer}>
              <label htmlFor="bulk-image" className={styles.fileInputLabel}>
                <Upload size={16} />
                <span>Choose File</span>
              </label>
              <input type="file" id="bulk-image" accept="image/*" onChange={handleImageChange} className={styles.fileInput} />
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
            <label htmlFor="order">Display Order</label>
            <input type="number" id="order" value={order} onChange={(e) => setOrder(e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.secondaryButton}>Cancel</button>
            <button type="submit" className={styles.primaryButton}>{initialData?.id ? "Save Changes" : "Create Banner"}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default function BulkBanners() {
  const [banners, setBanners] = useState<BulkBanner[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<BulkBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<BulkBanner | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const DROPDOWN_WIDTH = 130;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<any[]>("/bulk-banners?admin=true");
        const mappedBanners = response.data.map(normalizeBanner);
        setBanners(mappedBanners.sort((a, b) => a.order - b.order));
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load bulk banners.");
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
    setMenuRect({
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX - DROPDOWN_WIDTH,
    });
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleModalSubmit = async (bannerData: BannerFormPayload) => {
    setIsMutating(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', bannerData.title);
    formData.append('order', String(bannerData.order));
    formData.append('status', bannerData.status);
    if (bannerData.link) formData.append('link', bannerData.link);

    if (bannerData.imageUrl && typeof bannerData.imageUrl !== 'string') {
      formData.append('image', bannerData.imageUrl);
    }

    try {
      if (bannerData.id) {
        // Update banner
        const response = await axiosInstance.put<any>(`/bulk-banners/${bannerData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const updatedBanner = normalizeBanner(response.data);
        setBanners(prev => prev.map(b => (b.id === updatedBanner.id ? updatedBanner : b)).sort((a, b) => a.order - b.order));
        toast.success("Bulk banner updated successfully!");
      } else {
        // Create banner
        if (!bannerData.imageUrl) throw new Error("Image is required to create a banner.");
        const response = await axiosInstance.post<any>('/bulk-banners', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const newBanner = normalizeBanner(response.data);
        setBanners(prev => [...prev, newBanner].sort((a, b) => a.order - b.order));
        toast.success("Bulk banner created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save bulk banner.");
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
    if (!bannerToDelete) return;

    setIsConfirmModalOpen(false);
    setIsMutating(true);
    setError(null);
    try {
      await axiosInstance.delete(`/bulk-banners/${bannerToDelete}`);
      setBanners(prev => prev.filter(b => b.id !== bannerToDelete));
      toast.success("Bulk banner deleted successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete bulk banner.");
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

  const openEditModal = (banner: BulkBanner) => {
    setCurrentBanner(banner);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  if (loading) {
    return <div className={styles.container}>Loading bulk banners...</div>;
  }

  if (error) {
    return <div className={styles.container}><div className={styles.error}>Error: {error}</div></div>;
  }

  return (
    <div className={`${styles.container} ${isMutating ? styles.disabled : ''}`}>
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search bulk banners..." 
            className={styles.searchInput} 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <button className={styles.addButton} onClick={openCreateModal}>
          <Plus size={18} /> Add Bulk Banner
        </button>
      </div>

      {filteredBanners.length === 0 ? (
        <div className={styles.noData}>No bulk banners found. Click &quot;Add Bulk Banner&quot; to create one.</div>
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

      {/* PORTAL Dropdown */}
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
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this bulk banner? This action cannot be undone."
      />
    </div>
  );
}
