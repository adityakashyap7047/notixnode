"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
  Fragment,
} from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./Button";

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const DialogContext = createContext<DialogContextType | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within Dialog");
  }
  return context;
}

export function Dialog({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        handleOpenChange(false);
        triggerRef.current?.focus();
      }
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleOpenChange]);

  // Trap focus
  useEffect(() => {
    if (!open || !contentRef.current) return;
    
    const content = contentRef.current;
    const focusableElements = content.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTabKey(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }

    content.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => content.removeEventListener("keydown", handleTabKey);
  }, [open]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <DialogContext.Provider
      value={{ open, onOpenChange: handleOpenChange, triggerRef, contentRef }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, onOpenChange } = useDialogContext();

  return (
    <Button
      variant="outline"
      className={className}
      onClick={() => onOpenChange(!open)}
      {...props}
    >
      {children}
    </Button>
  );
}

export function DialogPortal({
  children,
}: {
  children: ReactNode;
}) {
  const { open } = useDialogContext();
  
  if (!open) return null;
  
  return (
    <Fragment>
      {children}
    </Fragment>
  );
}

export function DialogOverlay({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open, onOpenChange } = useDialogContext();

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
}

export function DialogContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open, contentRef } = useDialogContext();

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
        "rounded-xl bg-card p-6 shadow-xl border border-border",
        "data-[state=open]:animate-slide-up data-[state=closed]:animate-slide-down",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function DialogFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogClose({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = useDialogContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", className)}
      onClick={() => onOpenChange(false)}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </Button>
  );
}