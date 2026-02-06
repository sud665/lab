"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Card, Badge, Skeleton } from "@/components/ui";

export interface BoardItem {
  id: string | number;
  title: string;
  author: string;
  date: string | Date;
  views?: number;
  comments?: number;
  category?: string;
  pinned?: boolean;
}

export interface BoardListProps {
  items: BoardItem[];
  onItemClick?: (item: BoardItem) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  loading?: boolean;
  emptyMessage?: string;
  showCategory?: boolean;
  className?: string;
}

export function BoardList({
  items,
  onItemClick,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  loading = false,
  emptyMessage = "No posts found",
  showCategory = true,
  className,
}: BoardListProps) {
  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, "MM-dd");
  };

  // Loading state
  if (loading) {
    return (
      <Card className={cn("w-full overflow-hidden", className)}>
        <div className="divide-y divide-[var(--border-default)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <Skeleton width={60} height={24} />
              <div className="flex-1">
                <Skeleton width="60%" height={20} />
                <Skeleton width="30%" height={16} className="mt-2" />
              </div>
              <Skeleton width={80} height={16} />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <Card className={cn("w-full p-12 text-center", className)}>
        <p className="text-[var(--text-muted)]">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-[var(--bg-tertiary)] border-b border-[var(--border-default)] text-sm font-medium text-[var(--text-secondary)]">
          {showCategory && <div className="col-span-2">Category</div>}
          <div className={showCategory ? "col-span-6" : "col-span-8"}>Title</div>
          <div className="col-span-2">Author</div>
          <div className="col-span-2 text-right">Date</div>
        </div>

        {/* Items */}
        <div className="divide-y divide-[var(--border-default)]">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className={cn(
                "grid grid-cols-12 gap-4 px-4 py-4",
                "hover:bg-[var(--bg-tertiary)] transition-colors",
                onItemClick && "cursor-pointer",
                item.pinned && "bg-[var(--bg-tertiary)]/50"
              )}
            >
              {/* Category (Desktop) */}
              {showCategory && (
                <div className="hidden md:flex col-span-2 items-center">
                  {item.pinned ? (
                    <Badge variant="outline" size="sm">
                      📌 Notice
                    </Badge>
                  ) : item.category ? (
                    <Badge variant="outline" size="sm">
                      {item.category}
                    </Badge>
                  ) : null}
                </div>
              )}

              {/* Title */}
              <div className={cn("col-span-12 md:col-span-6", !showCategory && "md:col-span-8")}>
                <div className="flex items-center gap-2">
                  {/* Category badge for mobile */}
                  {showCategory && item.category && (
                    <Badge variant="outline" size="sm" className="md:hidden">
                      {item.pinned ? "📌" : item.category}
                    </Badge>
                  )}
                  <span
                    className={cn(
                      "text-[var(--text-primary)] truncate",
                      item.pinned && "font-medium"
                    )}
                  >
                    {item.title}
                  </span>
                  {item.comments && item.comments > 0 && (
                    <span className="text-sm text-[var(--text-muted)]">
                      [{item.comments}]
                    </span>
                  )}
                </div>
                {/* Mobile meta */}
                <div className="flex items-center gap-3 mt-1 text-sm text-[var(--text-muted)] md:hidden">
                  <span>{item.author}</span>
                  <span>{formatDate(item.date)}</span>
                  {item.views !== undefined && <span>Views {item.views}</span>}
                </div>
              </div>

              {/* Author (Desktop) */}
              <div className="hidden md:flex col-span-2 items-center text-sm text-[var(--text-secondary)]">
                {item.author}
              </div>

              {/* Date (Desktop) */}
              <div className="hidden md:flex col-span-2 items-center justify-end text-sm text-[var(--text-muted)]">
                <div className="text-right">
                  <div>{formatDate(item.date)}</div>
                  {item.views !== undefined && (
                    <div className="text-xs">Views {item.views}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
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
                  onClick={() => onPageChange?.(pageNum)}
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
              onClick={() => onPageChange?.(currentPage + 1)}
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
