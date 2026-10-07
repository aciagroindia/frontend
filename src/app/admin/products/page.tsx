"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import AdvancedTable from "../../../../components/admin-ui/AdvancedTable";
import Modal from "../../../../components/admin-ui/Modal";
import ProductForm from "../../../../components/admin-porducts/AddProductForm";
import { useProducts, Product } from "../../../../context/ProductContext";
import { Plus } from "lucide-react";
import styles from "./ProductsPage.module.css";

export default function ProductsPage() {
  const { products, loading, fetchProducts, addProduct, updateProduct, deleteProduct, toggleBestSeller } = useProducts();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Admin panel needs to see ALL products (Active + Inactive)
  useEffect(() => {
    fetchProducts('all');
  }, [fetchProducts]);

  // Handlers
  const handleToggleBestSeller = async (id: string) => {
    setTogglingId(id);
    await toggleBestSeller(id);
    setTogglingId(null);
  };

  const handleAdd = async (formData: FormData) => {
    setIsMutating(true);
    const success = await addProduct(formData);
    setIsMutating(false);
    if (success) {
      setIsAddModalOpen(false);
    }
    return success;
  };

  const handleDelete = (row: Product) => {
    setProductToDelete(row);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsMutating(true);
    await deleteProduct(productToDelete._id);
    setIsMutating(false);
    setProductToDelete(null); // Close the modal
  };

  const handleEdit = (row: Product) => setEditProduct(row);

  const handleUpdate = async (formData: FormData) => {
    if (!editProduct) return false;
    setIsMutating(true);
    const success = await updateProduct(editProduct._id, formData);
    setIsMutating(false);
    if (success) {
      setEditProduct(null);
    }
    return success;
  };

  // Column Definitions
  const getStatusInfo = (product: Product) => {
    const stock = product.stock;

    if (product.status === 'Inactive' || stock === 0) {
      return { text: 'Out of Stock', className: 'outofstock' };
    }
    if (stock < 20) { // Low stock threshold
      return { text: 'Low Stock', className: 'lowstock' };
    }
    return { text: 'In Stock', className: 'instock' };
  };

  // Best seller count
  const bestSellerCount = products.filter(p => p.isBestSeller).length;

  // FIX: Table ke liye data ko pehle se taiyaar karein taaki nested properties (jaise category.name) me confusion na ho.
  const tableData = products.map(product => ({
    ...product,
    categoryName: product.category?.name || 'N/A',
  }));

  const columns = [
    { key: "name", label: "Product Name" },
    { 
      key: "categoryName", 
      label: "Category",
    },
    { 
      key: "price", 
      label: "Price / Variants",
      render: (_: any, row: Product) => {
        if (row.packages && row.packages.length > 0) {
          const prices = row.packages
            .map((p: any) => Number(p.price))
            .filter((p: number) => !isNaN(p) && p > 0);
          if (prices.length > 1) {
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            return (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className={styles.priceText}>₹{min} - ₹{max}</span>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>{row.packages.length} variants</span>
              </div>
            );
          } else if (prices.length === 1) {
            return (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className={styles.priceText}>₹{prices[0]}</span>
                {row.packages[0].name && (
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{row.packages[0].name}</span>
                )}
              </div>
            );
          }
        }
        return <span className={styles.priceText}>₹{(Number(row.price) || 0).toFixed(2)}</span>;
      }
    },
    { key: "stock", label: "Stock" },
    { 
      key: "status", 
      label: "Status",
      render: (_: any, row: Product) => {
        const statusInfo = getStatusInfo(row);
        return (
          <span className={`${styles.statusBadge} ${styles[statusInfo.className]}`}>
            {statusInfo.text}
          </span>
        );
      }
    },
    {
      key: "isBestSeller",
      label: "Best Seller (Homepage)",
      render: (_: any, row: Product) => {
        const isToggling = togglingId === row._id;
        const isBS = Boolean(row.isBestSeller);
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleBestSeller(row._id);
            }}
            disabled={isToggling}
            title={isBS ? "Click to remove from Homepage Best Sellers" : "Click to mark as Homepage Best Seller"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: isToggling ? "wait" : "pointer",
              border: isBS ? "1px solid #f59e0b" : "1px solid #d1d5db",
              backgroundColor: isBS ? "#fef3c7" : "#f9fafb",
              color: isBS ? "#92400e" : "#6b7280",
              transition: "all 0.2s ease",
              boxShadow: isBS ? "0 1px 2px rgba(245, 158, 11, 0.2)" : "none",
            }}
          >
            <span>{isToggling ? "⏳ Updating..." : isBS ? "⭐ Best Seller" : "☆ Standard"}</span>
          </button>
        );
      }
    },
  ];

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h1 className={styles.title}>Inventory</h1>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
              padding: "4px 10px",
              borderRadius: "16px",
              fontSize: "12px",
              fontWeight: 600,
            }}>
              ⭐ Featured in Best Sellers: <strong>{bestSellerCount} / 12</strong>
            </span>
          </div>
          <p className={styles.subtitle}>Manage your products, stock levels, and Best Selling showcase (12 slots on Homepage)</p>
        </div>
        <button 
          className={styles.addBtn} 
          onClick={() => setIsAddModalOpen(true)}
          disabled={isMutating}
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <AdvancedTable
            columns={columns}
            data={tableData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Add Product Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
      >
        <ProductForm 
          onSubmit={handleAdd}
          buttonText="Add Product"
          isSubmitting={isMutating}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal 
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        title="Edit Product"
      >
        <ProductForm
          initialData={editProduct}
          onSubmit={handleUpdate}
          buttonText="Update Product"
          isSubmitting={isMutating}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Confirm Deletion"
      >
        {productToDelete && (
          <div>
            <p style={{ margin: "0 0 1rem" }}>
              Are you sure you want to delete the product "
              <strong>{productToDelete.name}</strong>"? This action cannot be
              undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button
                className={styles.secondaryButton}
                onClick={() => setProductToDelete(null)}
                disabled={isMutating}
              >
                Cancel
              </button>
              <button className={styles.deleteButton} onClick={handleConfirmDelete} disabled={isMutating}>
                {isMutating ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}