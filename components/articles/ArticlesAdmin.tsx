"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  BookOpen, 
  CheckCircle, 
  FileText 
} from "lucide-react";
import styles from "./ArticlesAdmin.module.css";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import ArticleEditorModal, { ArticleData } from "./ArticleEditorModal";
import ConfirmationModal from "../signUP/ConfirmationModal";

export default function ArticlesAdmin() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<ArticleData | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/articles?admin=true");
      if (response.data.success) {
        setArticles(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching articles:", error);
      toast.error(error.response?.data?.message || "Failed to load articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreateOrUpdate = async (formData: FormData, id?: string) => {
    try {
      setIsSaving(true);
      if (id) {
        // Update
        const response = await axiosInstance.put(`/articles/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (response.data.success) {
          toast.success("Article updated successfully!");
          setArticles(prev => prev.map(a => (a._id === id || a.id === id ? response.data.data : a)));
          setIsEditorOpen(false);
        }
      } else {
        // Create
        const response = await axiosInstance.post("/articles", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (response.data.success) {
          toast.success("Article published successfully!");
          setArticles(prev => [response.data.data, ...prev]);
          setIsEditorOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error saving article:", error);
      toast.error(error.response?.data?.message || "Failed to save article.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    const id = articleToDelete._id || articleToDelete.id;
    try {
      await axiosInstance.delete(`/articles/${id}`);
      toast.success("Article deleted successfully!");
      setArticles(prev => prev.filter(a => a._id !== id && a.id !== id));
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      console.error("Error deleting article:", error);
      toast.error(error.response?.data?.message || "Failed to delete article.");
    } finally {
      setArticleToDelete(null);
    }
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (article: ArticleData) => {
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  const openDeleteModal = (article: ArticleData) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  // Filtered list
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || article.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalCount = articles.length;
  const publishedCount = articles.filter(a => a.status === "Published").length;
  const draftCount = articles.filter(a => a.status === "Draft").length;

  return (
    <div className={styles.container}>
      {/* Top Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><BookOpen size={22} /></div>
          <div className={styles.statInfo}>
            <h4>Total Articles</h4>
            <p>{totalCount}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(22, 101, 52, 0.1)", color: "#166534" }}>
            <CheckCircle size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Published</h4>
            <p>{publishedCount}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(217, 119, 6, 0.1)", color: "#d97706" }}>
            <FileText size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Drafts</h4>
            <p>{draftCount}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchAndFilter}>
          <div className={styles.searchBar}>
            <Search size={17} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search articles by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.statusFilter}
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
          </select>
        </div>

        <button onClick={openCreateModal} className={styles.createBtn}>
          <Plus size={18} /> Write Article
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.emptyState}>Loading articles...</div>
        ) : filteredArticles.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No articles found</h3>
            <p>Click &quot;Write Article&quot; to publish your first blog post.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "90px" }}>Image</th>
                  <th>Article Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => {
                  const id = article._id || article.id;
                  const dateStr = article.createdAt 
                    ? new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })
                    : "-";

                  return (
                    <tr key={id}>
                      <td>
                        <div className={styles.articleImgWrapper}>
                          {article.image && (
                            <Image
                              src={article.image}
                              alt={article.title}
                              fill
                              sizes="90px"
                              style={{ objectFit: "contain" }}
                            />
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.articleTitleCell}>
                          <span className={styles.articleTitle}>{article.title}</span>
                          <span className={styles.articleSlug}>/blogs/articles/{article.slug}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            article.status === "Published" ? styles.statusPublished : styles.statusDraft
                          }`}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td style={{ color: "#64748b", fontSize: "0.85rem" }}>
                        {dateStr}
                      </td>
                      <td>
                        <div className={styles.actionsCell}>
                          <Link
                            href={`/blogs/articles/${article.slug}`}
                            target="_blank"
                            className={styles.actionBtn}
                            title="View Live Article"
                          >
                            <ExternalLink size={15} />
                          </Link>
                          <button
                            onClick={() => openEditModal(article)}
                            className={styles.actionBtn}
                            title="Edit Article"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(article)}
                            className={`${styles.actionBtn} ${styles.danger}`}
                            title="Delete Article"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <ArticleEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingArticle}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Article"
        message={`Are you sure you want to permanently delete "${articleToDelete?.title}"? This will remove it from the website.`}
      />
    </div>
  );
}
