"use client";

import { cn } from "@/lib/utils";
import { Button } from "./Button";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost";
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-4", className)}>
      {icon && (
        <div className="mb-4 text-muted-foreground" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
      )}
      {action && (
        <Button variant={action.variant || "primary"} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function EmptyStateCard({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("card-base p-8", className)}>
      <EmptyState icon={icon} title={title} description={description} action={action} />
    </div>
  );
}

// Predefined empty states for common use cases
export function NoResultsEmptyState({
  onClearFilters,
}: {
  onClearFilters?: () => void;
}) {
  return (
    <EmptyState
      icon={<svg className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>}
      title="No results found"
      description="Try adjusting your search or filters to find what you're looking for."
      action={onClearFilters ? {
        label: "Clear Filters",
        onClick: onClearFilters,
        variant: "outline",
      } : undefined}
    />
  );
}

export function NoResourcesEmptyState({
  onBrowseAll,
}: {
  onBrowseAll?: () => void;
}) {
  return (
    <EmptyState
      icon={<svg className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
      title="No resources yet"
      description="Be the first to publish a resource in this category."
      action={onBrowseAll ? {
        label: "Browse All Resources",
        onClick: onBrowseAll,
      } : undefined}
    />
  );
}

export function NoTutorialsEmptyState() {
  return (
    <EmptyState
      icon={<svg className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
      title="No tutorials available"
      description="Check back soon for new guides and tutorials."
    />
  );
}

export function NoToolsEmptyState() {
  return (
    <EmptyState
      icon={<svg className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>}
      title="No tools available"
      description="Developer tools are currently in development."
    />
  );
}