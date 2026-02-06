"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface TimePickerProps {
  value?: string;
  onChange?: (time: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  step?: number;
  minTime?: string;
  maxTime?: string;
  className?: string;
}

function generateTimeSlots(step: number, minTime?: string, maxTime?: string): string[] {
  const slots: string[] = [];
  const [minHour, minMinute] = minTime ? minTime.split(":").map(Number) : [0, 0];
  const [maxHour, maxMinute] = maxTime ? maxTime.split(":").map(Number) : [23, 59];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += step) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const totalMinutes = hour * 60 + minute;
      const minTotalMinutes = minHour * 60 + minMinute;
      const maxTotalMinutes = maxHour * 60 + maxMinute;

      if (totalMinutes >= minTotalMinutes && totalMinutes <= maxTotalMinutes) {
        slots.push(time);
      }
    }
  }

  return slots;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time...",
  disabled = false,
  step = 30,
  minTime,
  maxTime,
  className,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const timeSlots = useMemo(() => generateTimeSlots(step, minTime, maxTime), [step, minTime, maxTime]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to selected time when opened
  useEffect(() => {
    if (isOpen && listRef.current && value) {
      const selectedIndex = timeSlots.indexOf(value);
      if (selectedIndex !== -1) {
        const element = listRef.current.children[selectedIndex] as HTMLElement;
        if (element) {
          element.scrollIntoView({ block: "center" });
        }
        setHighlightedIndex(selectedIndex);
      }
    }
  }, [isOpen, value, timeSlots]);

  const handleSelect = useCallback((time: string) => {
    onChange?.(time);
    setIsOpen(false);
  }, [onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
  }, [onChange]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (isOpen && timeSlots[highlightedIndex]) {
          handleSelect(timeSlots[highlightedIndex]);
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
            prev < timeSlots.length - 1 ? prev + 1 : prev
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
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-[var(--text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span
            className={cn(
              value ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
            )}
          >
            {value || placeholder}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {value && (
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
          ref={listRef}
          className={cn(
            "absolute z-50 w-full mt-1 py-1",
            "max-h-60 overflow-y-auto",
            "rounded-lg border bg-[var(--bg-secondary)]",
            "border-[var(--border-default)]",
            "shadow-lg shadow-black/20",
            "animate-fade-in"
          )}
        >
          {timeSlots.map((time, index) => (
            <button
              key={time}
              type="button"
              onClick={() => handleSelect(time)}
              className={cn(
                "w-full px-4 py-2 text-left text-sm transition-colors",
                "text-[var(--text-primary)]",
                time === value && "bg-white/10 font-medium",
                index === highlightedIndex && time !== value && "bg-white/5",
                "hover:bg-white/5"
              )}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
