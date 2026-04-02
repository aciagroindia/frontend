"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { MoreHorizontal, Trash2, Pencil, Plus } from "lucide-react";
import styles from "./Categories.module.css";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import { useCategories, Category } from "../../context/CategoryContext";
import { toast } from "react-hot-toast";

export default function CategoriesPage() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isMutating, setIsMutating] = useState(false); // ✅ UI Lock state

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on scroll or click outside
  useEffect(() => {
    const handleClose = () => setOpenMenuId(null);
    if (openMenuId) {
      window.addEventListener("scroll", handleClose);
      window.addEventListener("mousedown", (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) handleClose();
      });
    }
    return () => {
      window.removeEventListener("scroll", handleClose);
    };
  }, [openMenuId]);

  const handleOpenMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + window.scrollY + 5, left: rect.right - 140 });
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // ✅ Add Logic
  const handleAddSubmit = async (formData: FormData) => {
    setIsMutating(true);
    const success = await addCategory(formData);
    setIsMutating(false);
    return success;
  };

  // ✅ Edit Logic
  const handleEditSubmit = async (formData: FormData) => {
    if (!currentCategory) return false;
    setIsMutating(true);
    const success = await updateCategory(currentCategory._id, formData);
    setIsMutating(false);
    return success;
  };

  // ✅ Delete Logic
  const handleDelete = async (id: string) => {
    setIsMutating(true);
    await deleteCategory(id);
    setIsMutating(false);
    setOpenMenuId(null);
  };

  if (loading) return <div className={styles.container}>Loading categories...</div>;

  return (
    <div className={`${styles.container}`}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>Manage Categories</h1>
        <button className={styles.addButton} onClick={() => setAddModalOpen(true)}>
         {isMutating ? "Processing..." : <><Plus size={18} /> Add Category</>}
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Status</th>
              <th className={styles.actionsHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td>
                  <div className={styles.imageWrapper}>
                    <Image src={cat.image} alt={cat.name} width={40} height={40} className={styles.categoryImage} />
                  </div>
                </td>
                <td className={styles.categoryName}>{cat.name}</td>
                <td>
                  <span className={`${styles.status} ${cat.status === "Active" ? styles.active : styles.inactive}`}>
                    {cat.status}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionButton} onClick={(e) => handleOpenMenu(e, cat._id)}>
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Action Menu Dropdown (Portal) */}
      {openMenuId !== null && createPortal(
        <div 
          className={styles.actionsDropdown} 
          ref={menuRef} 
          style={{ position: "absolute", top: menuPosition.top, left: menuPosition.left }}
        >
          <button className={styles.dropdownItem} onClick={() => {
            const cat = categories.find(c => c._id === openMenuId);
            if (cat) {
              setCurrentCategory(cat);
              setEditModalOpen(true);
              setOpenMenuId(null);
            }
          }}>
            <Pencil size={16} /> <span>Edit</span>
          </button>
          <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={() => handleDelete(openMenuId)}>
            <Trash2 size={16} /> <span>Delete</span>
          </button>
        </div>,
        document.body
      )}

      {/* Modals */}
      <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleAddSubmit} />
      <EditCategoryModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onSubmit={handleEditSubmit} category={currentCategory} />
    </div>
  );
}