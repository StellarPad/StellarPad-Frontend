"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-blue-950/80 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-blue-800/80 bg-surface/95 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4 pb-6 sm:items-center">
          <div>
            {title ? <h2 className="text-xl font-semibold text-foreground">{title}</h2> : null}
            {description ? <p className="mt-2 text-sm text-blue-200">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-blue-800/90 bg-blue-900/90 text-blue-100 transition hover:bg-blue-800"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className={cn("space-y-6", "text-sm text-blue-100")}>{children}</div>
      </div>
    </div>
  );
}
