"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Input } from "./Input";

export type DialogType = "alert" | "confirm" | "prompt";

export interface DialogProps {
  type: DialogType;
  open: boolean;
  onClose: () => void;
  onConfirm?: (value?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  placeholder?: string;
  defaultValue?: string;
}

export function Dialog({
  type,
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  placeholder = "Enter value...",
  defaultValue = "",
}: DialogProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset input when dialog opens
  useEffect(() => {
    if (open) {
      setInputValue(defaultValue);
      if (type === "prompt" && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [open, defaultValue, type]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Enter" && type !== "prompt") {
        handleConfirm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, type, onClose]);

  // Trap focus inside dialog
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleConfirm = useCallback(() => {
    if (type === "prompt") {
      onConfirm?.(inputValue);
    } else {
      onConfirm?.();
    }
    onClose();
  }, [type, inputValue, onConfirm, onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!open) return null;

  const iconMap = {
    alert: (
      <svg
        className="h-6 w-6 text-[var(--text-secondary)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    confirm: (
      <svg
        className="h-6 w-6 text-[var(--text-secondary)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    prompt: (
      <svg
        className="h-6 w-6 text-[var(--text-secondary)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        "flex items-center justify-center p-4",
        "bg-black/80 backdrop-blur-sm",
        "animate-fade-in"
      )}
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className={cn(
          "w-full max-w-md",
          "rounded-xl border bg-[var(--bg-secondary)]",
          "border-[var(--border-default)]",
          "shadow-xl shadow-black/40",
          "animate-slide-up"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className="p-2 rounded-full bg-[var(--bg-tertiary)]">
            {iconMap[type]}
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="dialog-title"
              className="text-lg font-semibold text-[var(--text-primary)]"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{message}</p>
          </div>
        </div>

        {/* Prompt Input */}
        {type === "prompt" && (
          <div className="px-6 pb-4">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirm();
                }
              }}
            />
          </div>
        )}

        {/* Footer */}
        <div
          className={cn(
            "flex justify-end gap-3 p-6 pt-4",
            "border-t border-[var(--border-default)]"
          )}
        >
          {type !== "alert" && (
            <Button variant="ghost" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          <Button variant="solid" onClick={handleConfirm}>
            {type === "alert" ? "OK" : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Convenience functions for programmatic usage
export function useDialog() {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    type: DialogType;
    title: string;
    message: string;
    resolve?: (value: boolean | string | undefined) => void;
    defaultValue?: string;
    placeholder?: string;
  }>({
    open: false,
    type: "alert",
    title: "",
    message: "",
  });

  const alert = useCallback((title: string, message: string) => {
    return new Promise<void>((resolve) => {
      setDialogState({
        open: true,
        type: "alert",
        title,
        message,
        resolve: () => resolve(),
      });
    });
  }, []);

  const confirm = useCallback((title: string, message: string) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        open: true,
        type: "confirm",
        title,
        message,
        resolve: (value) => resolve(value as boolean),
      });
    });
  }, []);

  const prompt = useCallback(
    (title: string, message: string, defaultValue = "", placeholder = "") => {
      return new Promise<string | undefined>((resolve) => {
        setDialogState({
          open: true,
          type: "prompt",
          title,
          message,
          defaultValue,
          placeholder,
          resolve: (value) => resolve(value as string | undefined),
        });
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    if (dialogState.type === "confirm") {
      dialogState.resolve?.(false);
    } else if (dialogState.type === "prompt") {
      dialogState.resolve?.(undefined);
    } else {
      dialogState.resolve?.(undefined);
    }
    setDialogState((prev) => ({ ...prev, open: false }));
  }, [dialogState]);

  const handleConfirm = useCallback(
    (value?: string) => {
      if (dialogState.type === "confirm") {
        dialogState.resolve?.(true);
      } else if (dialogState.type === "prompt") {
        dialogState.resolve?.(value);
      } else {
        dialogState.resolve?.(undefined);
      }
      setDialogState((prev) => ({ ...prev, open: false }));
    },
    [dialogState]
  );

  const DialogComponent = (
    <Dialog
      type={dialogState.type}
      open={dialogState.open}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={dialogState.title}
      message={dialogState.message}
      defaultValue={dialogState.defaultValue}
      placeholder={dialogState.placeholder}
    />
  );

  return { alert, confirm, prompt, DialogComponent };
}
