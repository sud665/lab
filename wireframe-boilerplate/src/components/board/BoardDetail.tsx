"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Card, Button, Badge } from "@/components/ui";

export interface BoardDetailProps {
  title: string;
  content: string;
  author: string;
  date: string | Date;
  views?: number;
  category?: string;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  className?: string;
}

export function BoardDetail({
  title,
  content,
  author,
  date,
  views,
  category,
  onBack,
  onEdit,
  onDelete,
  showActions = false,
  className,
}: BoardDetailProps) {
  const formatDate = (d: string | Date) => {
    const dateObj = typeof d === "string" ? new Date(d) : d;
    return format(dateObj, "yyyy-MM-dd HH:mm");
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to list</span>
        </button>
      )}

      <Card className="overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-default)]">
          {/* Category */}
          {category && (
            <Badge variant="outline" size="sm" className="mb-3">
              {category}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{author}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(date)}</span>
            </div>

            {views !== undefined && (
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>{views.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div
            className="prose prose-invert max-w-none text-[var(--text-primary)]"
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.8,
            }}
          >
            {content}
          </div>
        </div>

        {/* Actions */}
        {showActions && (onEdit || onDelete) && (
          <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-default)]">
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                onClick={onDelete}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
