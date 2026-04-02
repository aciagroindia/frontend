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
  const { products, loading, fetchProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Admin panel needs to see ALL products (Active + Inactive)
  useEffect(() => {
    fetchProducts('all');
  }, [fetchProducts]);

  // Handlers
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
      label: "Price",
      render: (val: number) => <span className={styles.priceText}>₹{val?.toFixed(2)}</span>
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
  ];

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Inventory</h1>
          <p className={styles.subtitle}>Manage your products and stock levels</p>
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