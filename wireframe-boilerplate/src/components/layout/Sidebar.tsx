"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import type { SidebarItem } from "@/types";

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

export function Sidebar({
  items,
  collapsed = false,
  onCollapse,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "h-full border-r border-neutral-800 bg-neutral-950 transition-all duration-200",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        {onCollapse && (
          <div className="p-2 border-b border-neutral-800">
            <button
              onClick={() => onCollapse(!collapsed)}
              className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-neutral-400 transition-colors"
            >
              <svg
                className={cn(
                  "h-5 w-5 transition-transform",
                  collapsed && "rotate-180"
                )}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                item.active
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {!collapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
