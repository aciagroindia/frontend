"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import styles from "./DataTable.module.css";

interface Column {
  key: string;
  label: string;
  // Custom render function (e.g., status badges ya images ke liye)
  render?: (value: any, row: any) => React.ReactNode;
}

interface Props {
  columns: Column[];
  data: any[];
  itemsPerPage?: number;
}

export default function DataTable({ columns, data, itemsPerPage = 10 }: Props) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Optimized Search Logic using useMemo
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  // 2. Simple Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.container}>
      {/* Table Header / Search Area */}
      <div className={styles.tableHeader}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            className={styles.search}
            placeholder="Search records..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
          />
        </div>
        <div className={styles.resultsCount}>
          Found {filteredData.length} results
        </div>
      </div>

      {/* Table Structure */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.noData}>
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span>Page {currentPage} of {totalPages}</span>
          <div className={styles.pageButtons}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}