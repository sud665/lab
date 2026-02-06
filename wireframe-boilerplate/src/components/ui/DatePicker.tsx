"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date...",
  disabled = false,
  minDate,
  maxDate,
  dateFormat = "yyyy-MM-dd",
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Reset current month when value changes
  useEffect(() => {
    if (value) {
      setCurrentMonth(value);
    }
  }, [value]);

  const handlePrevMonth = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    onChange?.(date);
    setIsOpen(false);
  }, [onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
  }, [onChange]);

  const isDateDisabled = useCallback((date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }, [minDate, maxDate]);

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span
            className={cn(
              value ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
            )}
          >
            {value ? format(value, dateFormat) : placeholder}
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

      {/* Calendar Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1 p-4",
            "rounded-lg border bg-[var(--bg-secondary)]",
            "border-[var(--border-default)]",
            "shadow-lg shadow-black/20",
            "animate-fade-in"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <svg
                className="h-5 w-5 text-[var(--text-secondary)]"
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
            </button>
            <span className="text-[var(--text-primary)] font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <svg
                className="h-5 w-5 text-[var(--text-secondary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-xs text-[var(--text-muted)]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const isSelected = value && isSameDay(day, value);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isDisabled = isDateDisabled(day);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => !isDisabled && handleSelectDate(day)}
                  disabled={isDisabled}
                  className={cn(
                    "h-8 w-8 flex items-center justify-center rounded text-sm transition-colors",
                    !isCurrentMonth && "text-[var(--text-disabled)]",
                    isCurrentMonth && !isSelected && "text-[var(--text-primary)]",
                    isSelected && "bg-white/20 text-[var(--text-primary)] font-medium",
                    !isSelected && !isDisabled && "hover:bg-white/10",
                    isDisabled && "opacity-30 cursor-not-allowed",
                    isTodayDate && !isSelected && "ring-1 ring-[var(--border-focus)]"
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {/* Today button */}
          <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
            <button
              type="button"
              onClick={() => handleSelectDate(new Date())}
              className="w-full py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
