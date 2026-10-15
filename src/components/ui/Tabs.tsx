"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, orientation = "horizontal", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-col" : "flex-row",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Tabs.displayName = "Tabs";

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  "aria-label"?: string;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, "aria-label": ariaLabel, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md bg-card p-1 text-muted-foreground",
          "border border-border"
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled, children, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={false} // Will need context for actual state
        aria-controls={`${value}-panel`}
        id={`${value}-trigger`}
        data-value={value}
        data-state="inactive"
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
            className
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, forceMount, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tabpanel"
        aria-labelledby={`${value}-trigger`}
        id={`${value}-panel`}
        data-value={value}
        data-state="inactive"
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "data-[state=active]:animate-fade-in",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

// Simple context-based tabs implementation
import { createContext, useContext, useState, useMemo, type ReactNode } from "react";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
  orientation: "horizontal" | "vertical";
}

const TabsContext = createContext<TabsContextType | null>(null);

export function TabsRoot({
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = "horizontal",
  children,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  children: ReactNode;
  className?: string;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  
  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const contextValue = useMemo(
    () => ({ value, onValueChange: handleValueChange, orientation }),
    [value, handleValueChange, orientation]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("flex", orientation === "horizontal" ? "flex-col" : "flex-row", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsListComponent({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-card p-1 text-muted-foreground",
        "border border-border",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTriggerComponent({
  value,
  disabled,
  children,
  className,
}: {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within TabsRoot");
  
  const { value: currentValue, onValueChange, orientation } = context;
  const isSelected = currentValue === value;

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      aria-controls={`${value}-panel`}
      id={`${value}-trigger`}
      data-value={value}
      data-state={isSelected ? "active" : "inactive"}
      data-orientation={orientation}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        orientation === "vertical" ? "w-full justify-start" : "",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContentComponent({
  value,
  forceMount,
  children,
  className,
}: {
  value: string;
  forceMount?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within TabsRoot");
  
  const { value: currentValue } = context;
  const isSelected = currentValue === value;

  if (!forceMount && !isSelected) return null;

  return (
    <div
      role="tabpanel"
      aria-labelledby={`${value}-trigger`}
      id={`${value}-panel`}
      data-value={value}
      data-state={isSelected ? "active" : "inactive"}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[state=active]:animate-fade-in",
        className
      )}
      hidden={!isSelected}
    >
      {children}
    </div>
  );
}

export { TabsRoot as Tabs, TabsListComponent as TabsList, TabsTriggerComponent as TabsTrigger, TabsContentComponent as TabsContent };