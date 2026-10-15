"use client";

import { useState, useCallback, ReactNode, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { X } from "lucide-react";

export type ToastType = "default" | "success" | "warning" | "destructive" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  action?: ReactNode;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    
    if (toast.duration !== 0) {
      setTimeout(() => removeToast(id), toast.duration ?? 5000);
    }
    
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastViewport toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastViewport({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  const typeStyles = {
    default: "border-border",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    destructive: "border-destructive/30 bg-destructive/5",
    info: "border-primary/30 bg-primary/5",
  };

  const iconComponents = {
    default: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
    success: <svg className="h-5 w-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    warning: <svg className="h-5 w-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    destructive: <svg className="h-5 w-5 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
    info: <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto card-interactive p-4 shadow-xl animate-slide-up",
            typeStyles[toast.type]
          )}
          role="alert"
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">{iconComponents[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{toast.title}</p>
              {toast.description && (
                <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
              )}
              {toast.action && (
                <div className="mt-3">{toast.action}</div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onRemove(toast.id)}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}