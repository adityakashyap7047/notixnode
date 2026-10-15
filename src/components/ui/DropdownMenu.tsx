"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  type ReactNode,
  Fragment,
} from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Check } from "lucide-react";
import { Button } from "./Button";

interface DropdownMenuContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null);

function useDropdownMenuContext() {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within DropdownMenu");
  }
  return context;
}

export function DropdownMenu({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <DropdownMenuContext.Provider
      value={{ open, onOpenChange: handleOpenChange, triggerRef, contentRef }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, onOpenChange, triggerRef } = useDropdownMenuContext();

  return (
    <Button
      ref={triggerRef}
      variant="outline"
      className={cn("gap-2", className)}
      onClick={() => onOpenChange(!open)}
      aria-haspopup="menu"
      aria-expanded={open}
      {...props}
    >
      {children}
      <ChevronRight className={cn("h-4 w-4 transition-transform", open && "rotate-90")} />
    </Button>
  );
}

export function DropdownMenuContent({
  children,
  className,
  align = "end",
  sideOffset = 4,
  ...props
}: {
  children: ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { open, contentRef, triggerRef } = useDropdownMenuContext();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = triggerRect.left;
    if (align === "end") {
      left = triggerRect.right - contentRect.width;
    } else if (align === "center") {
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
    }

    // Keep within viewport
    if (left < 8) left = 8;
    if (left + contentRect.width > viewportWidth - 8) {
      left = viewportWidth - contentRect.width - 8;
    }

    let top = triggerRect.bottom + sideOffset;
    if (top + contentRect.height > viewportHeight - 8) {
      top = triggerRect.top - contentRect.height - sideOffset;
    }

    setPosition({ top: top + window.scrollY, left: left + window.scrollX });
  }, [open, align, sideOffset]);

  if (!open) return null;

  return (
    <Fragment>
      <div
        ref={contentRef}
        role="menu"
        className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-card p-1 text-popover-text shadow-md",
          "data-[state=open]:animate-slide-up data-[state=closed]:animate-slide-down"
        )}
        style={{
          top: position.top,
          left: position.left,
        }}
        {...props}
      >
        {children}
      </div>
    </Fragment>
  );
}

// Need to import React
import React from "react";

export function DropdownMenuItem({
  children,
  className,
  disabled,
  onSelect,
  inset,
  ...props
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onSelect?: () => void;
  inset?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { onOpenChange } = useDropdownMenuContext();

  const handleClick = () => {
    if (!disabled) {
      onSelect?.();
      onOpenChange(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      data-disabled={disabled ? "true" : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "focus:bg-accent focus:text-accent-foreground",
        "aria-disabled:opacity-50 aria-disabled:pointer-events-none",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuCheckboxItem({
  checked,
  children,
  className,
  disabled,
  onCheckedChange,
  ...props
}: {
  checked: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { onOpenChange } = useDropdownMenuContext();

  const handleClick = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
      onOpenChange(false);
    }
  };

  return (
    <div
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      data-disabled={disabled ? "true" : undefined}
      onClick={handleClick}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
}

export function DropdownMenuRadioItem({
  checked,
  children,
  className,
  disabled,
  onCheckedChange,
  ...props
}: {
  checked: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { onOpenChange } = useDropdownMenuContext();

  const handleClick = () => {
    if (!disabled && !checked) {
      onCheckedChange?.(true);
      onOpenChange(false);
    }
  };

  return (
    <div
      role="menuitemradio"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      data-disabled={disabled ? "true" : undefined}
      onClick={handleClick}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: {
  className?: string;
  inset?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
      {...props}
    />
  );
}

export function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
}

export function DropdownMenuGroup({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export function DropdownMenuSub({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

export function DropdownMenuSubTrigger({
  children,
  className,
  disabled,
  ...props
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { open, onOpenChange } = useDropdownMenuContext();
  const [subOpen, setSubOpen] = useState(false);

  return (
    <div
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={subOpen}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      data-disabled={disabled ? "true" : undefined}
      onMouseEnter={() => !disabled && setSubOpen(true)}
      onMouseLeave={() => setSubOpen(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" && !disabled) {
          event.preventDefault();
          setSubOpen(true);
        }
        if (event.key === "ArrowLeft") {
          setSubOpen(false);
        }
      }}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </div>
  );
}

export function DropdownMenuSubContent({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useDropdownMenuContext();
  const [subOpen, setSubOpen] = useState(false);

  // This is a simplified version - in a real implementation you'd need more complex positioning
  if (!subOpen) return null;

  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-card p-1 text-popover-text shadow-md",
        "left-full top-0 mt-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}