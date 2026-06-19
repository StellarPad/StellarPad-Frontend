"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * ToastProvider - Context provider for toast notifications
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", duration = 5000) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * useToast - Hook to use toast notifications
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

/**
 * ToastContainer - Displays all active toasts
 */
function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

/**
 * ToastItem - Individual toast notification
 */
function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const typeStyles: Record<ToastType, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
    success: {
      bg: "bg-green-950/90",
      border: "border-green-700",
      text: "text-green-200",
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
    },
    error: {
      bg: "bg-red-950/90",
      border: "border-red-700",
      text: "text-red-200",
      icon: <AlertCircle className="h-5 w-5 text-red-400" />,
    },
    warning: {
      bg: "bg-yellow-950/90",
      border: "border-yellow-700",
      text: "text-yellow-200",
      icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
    },
    info: {
      bg: "bg-blue-950/90",
      border: "border-blue-700",
      text: "text-blue-200",
      icon: <Info className="h-5 w-5 text-blue-400" />,
    },
  };

  const style = typeStyles[toast.type];

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border ${style.bg} ${style.border} p-4 backdrop-blur-sm transition-all duration-300 ${
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      }`}
    >
      <div className="mt-0.5">{style.icon}</div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${style.text}`}>{toast.message}</p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              handleClose();
            }}
            className={`text-xs font-semibold mt-2 hover:underline ${style.text}`}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleClose}
        className={`flex-shrink-0 mt-0.5 hover:opacity-70 transition-opacity ${style.text}`}
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Toast utility functions for common use cases
 */
export const toast = {
  success: (message: string) => {
    if (typeof window !== "undefined") {
      const context = (document as any).__toastContext;
      context?.addToast(message, "success");
    }
  },

  error: (message: string) => {
    if (typeof window !== "undefined") {
      const context = (document as any).__toastContext;
      context?.addToast(message, "error");
    }
  },

  warning: (message: string) => {
    if (typeof window !== "undefined") {
      const context = (document as any).__toastContext;
      context?.addToast(message, "warning");
    }
  },

  info: (message: string) => {
    if (typeof window !== "undefined") {
      const context = (document as any).__toastContext;
      context?.addToast(message, "info");
    }
  },
};
