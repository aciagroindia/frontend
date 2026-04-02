"use client";

import { useState, useMemo, useEffect } from "react";
import { Edit2, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import styles from "./AdvancedTable.module.css";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface Props {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  pageSize?: number;
}

export default function AdvancedTable({ columns, data, onEdit, onDelete, pageSize = 7 }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  // 1. Search filter reset page to 1
  useEffect(() => {
    setPage(1);
  }, [search]);

  // 2. Optimized Filtering & Sorting using useMemo
  const processedData = useMemo(() => {
    let filtered = data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );

    if (sortKey) {
      filtered.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal < bVal) return sortAsc ? -1 : 1;
        if (aVal > bVal) return sortAsc ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [data, search, sortKey, sortAsc]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Bar: Search */}
      <div className={styles.topBar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            className={styles.search}
            placeholder="Search all records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={col.sortable !== false ? styles.sortableTh : ""}
                >
                  <div className={styles.thContent}>
                    {col.label}
                    {col.sortable !== false && (
                      <span className={styles.sortIcon}>
                        {sortKey !== col.key ? <ArrowUpDown size={14} /> : 
                         sortAsc ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && <th className={styles.actionTh}>Actions</th>}
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
                  {(onEdit || onDelete) && (
                    <td className={styles.actions}>
                      {onEdit && (
                        <button className={styles.editBtn} onClick={() => onEdit(row)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button className={styles.deleteBtn} onClick={() => onDelete(row)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className={styles.empty}>
                  No matching data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Bar: Pagination */}
      <div className={styles.pagination}>
        <p className={styles.pageInfo}>
          Showing {Math.min(paginatedData.length, 1)} to {paginatedData.length} of {processedData.length} entries
        </p>
        <div className={styles.pageControls}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft size={18} />
          </button>
          <span className={styles.pageNumber}>Page {page} of {totalPages || 1}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}