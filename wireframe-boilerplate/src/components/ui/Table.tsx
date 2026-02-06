"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

export function Table<T extends object>({
  columns,
  data,
  sortable = false,
  pagination = false,
  pageSize = 10,
  currentPage: controlledPage,
  totalItems,
  onPageChange,
  onSort,
  onRowClick,
  emptyMessage = "No data found",
  loading = false,
  className,
}: TableProps<T>) {
  const [internalPage, setInternalPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const currentPage = controlledPage ?? internalPage;
  const total = totalItems ?? data.length;
  const totalPages = Math.ceil(total / pageSize);

  const handleSort = useCallback(
    (key: string) => {
      if (!sortable) return;

      const newDirection =
        sortKey === key && sortDirection === "asc" ? "desc" : "asc";

      setSortKey(key);
      setSortDirection(newDirection);
      onSort?.(key, newDirection);
    },
    [sortable, sortKey, sortDirection, onSort]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;

      if (onPageChange) {
        onPageChange(page);
      } else {
        setInternalPage(page);
      }
    },
    [totalPages, onPageChange]
  );

  // Sort and paginate data (only if no external handlers)
  const processedData = useMemo(() => {
    let result = [...data];

    // Sort internally if no external handler
    if (sortable && sortKey && !onSort) {
      result.sort((a, b) => {
        const aVal = a[sortKey as keyof T];
        const bVal = b[sortKey as keyof T];

        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    // Paginate internally if no external handler
    if (pagination && !onPageChange) {
      const start = (currentPage - 1) * pageSize;
      result = result.slice(start, start + pageSize);
    }

    return result;
  }, [data, sortable, sortKey, sortDirection, pagination, currentPage, pageSize, onSort, onPageChange]);

  const getCellValue = (row: T, column: TableColumn<T>, index: number) => {
    const value = row[column.key as keyof T];

    if (column.render) {
      return column.render(value, row, index);
    }

    return value as React.ReactNode;
  };

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn("w-full overflow-hidden rounded-lg border border-[var(--border-default)]", className)}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-tertiary)]">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: pageSize }).map((_, i) => (
              <tr key={i} className="border-b border-[var(--border-default)] last:border-0">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3">
                    <Skeleton width="80%" height={20} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-hidden rounded-lg border border-[var(--border-default)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-tertiary)]">
                {columns.map((column) => {
                  const isSortable = sortable && column.sortable !== false;
                  const isSorted = sortKey === column.key;

                  return (
                    <th
                      key={String(column.key)}
                      className={cn(
                        "px-4 py-3 text-sm font-medium text-[var(--text-secondary)]",
                        alignClass[column.align || "left"],
                        isSortable && "cursor-pointer hover:text-[var(--text-primary)] select-none"
                      )}
                      style={{ width: column.width }}
                      onClick={() => isSortable && handleSort(String(column.key))}
                    >
                      <div className="flex items-center gap-1">
                        <span>{column.header}</span>
                        {isSortable && (
                          <span className="text-xs">
                            {isSorted ? (
                              sortDirection === "asc" ? (
                                "▲"
                              ) : (
                                "▼"
                              )
                            ) : (
                              <span className="opacity-30">⇅</span>
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {processedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-[var(--text-muted)]"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                processedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    onClick={() => onRowClick?.(row, rowIndex)}
                    className={cn(
                      "border-b border-[var(--border-default)] last:border-0",
                      "bg-[var(--bg-secondary)]",
                      "hover:bg-[var(--bg-tertiary)]",
                      "transition-colors",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          "px-4 py-3 text-sm text-[var(--text-primary)]",
                          alignClass[column.align || "left"]
                        )}
                      >
                        {getCellValue(row, column, rowIndex)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-sm text-[var(--text-muted)]">
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, total)} of {total}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                "border border-[var(--border-default)]",
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/5"
              )}
            >
              ◀
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    "min-w-[36px] px-3 py-1.5 rounded-lg text-sm transition-colors",
                    pageNum === currentPage
                      ? "bg-white/10 text-[var(--text-primary)] font-medium"
                      : "text-[var(--text-secondary)] hover:bg-white/5"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                "border border-[var(--border-default)]",
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/5"
              )}
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
