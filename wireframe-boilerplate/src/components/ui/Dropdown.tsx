"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  disabled = false,
  searchable = false,
  clearable = false,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable && search
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleSelect = useCallback((optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearch("");
  }, [onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
    setSearch("");
  }, [onChange]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Reset highlight when options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions.length]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (isOpen && filteredOptions[highlightedIndex]) {
          const opt = filteredOptions[highlightedIndex];
          if (!opt.disabled) {
            handleSelect(opt.value);
          }
        } else {
          setIsOpen(true);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearch("");
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 py-2.5",
          "rounded-lg border bg-[var(--bg-tertiary)] text-left",
          "border-[var(--border-default)]",
          "hover:border-[var(--border-hover)]",
          "focus:outline-none focus:border-[var(--border-focus)]",
          "transition-colors",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "border-[var(--border-focus)]"
        )}
      >
        <span
          className={cn(
            "truncate",
            selectedOption
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-muted)]"
          )}
        >
          {selectedOption?.label || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {clearable && value && (
            <span
              onClick={handleClear}
              className="p-1 hover:bg-white/10 rounded cursor-pointer"
            >
              <svg
                className="h-4 w-4 text-[var(--text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          )}
          <svg
            className={cn(
              "h-5 w-5 text-[var(--text-muted)] transition-transform",
              isOpen && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full mt-1",
            "rounded-lg border bg-[var(--bg-secondary)]",
            "border-[var(--border-default)]",
            "shadow-lg shadow-black/20",
            "animate-fade-in"
          )}
        >
          {/* Search */}
          {searchable && (
            <div className="p-2 border-b border-[var(--border-default)]">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className={cn(
                  "w-full px-3 py-2 rounded-md",
                  "bg-[var(--bg-tertiary)] border border-[var(--border-default)]",
                  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                  "focus:outline-none focus:border-[var(--border-focus)]"
                )}
              />
            </div>
          )}

          {/* Options */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-[var(--text-muted)] text-sm">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm transition-colors",
                    option.disabled
                      ? "text-[var(--text-disabled)] cursor-not-allowed"
                      : "text-[var(--text-primary)] cursor-pointer",
                    option.value === value && "bg-white/10",
                    index === highlightedIndex && !option.disabled && "bg-white/5",
                    !option.disabled && "hover:bg-white/5"
                  )}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
