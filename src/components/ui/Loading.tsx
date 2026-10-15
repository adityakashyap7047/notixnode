"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <svg
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function LoadingDots({
  className,
}: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-hidden="true">
      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

export function LoadingBar({
  className,
}: { className?: string }) {
  return (
    <div className={cn("w-full h-2 bg-border rounded-full overflow-hidden", className)} aria-hidden="true">
      <div className="h-full bg-primary animate-pulse" style={{ width: "100%" }} />
    </div>
  );
}

export function PageLoader({
  text = "Loading...",
  className,
}: { text?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[300px] gap-4", className)}>
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

export function InlineLoader({
  text,
  className,
}: { text?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LoadingSpinner size="sm" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

export function ButtonLoader({
  className,
}: { className?: string }) {
  return (
    <LoadingSpinner size="sm" className={cn(className)} />
  );
}

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "card";
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function SkeletonComponent({
  variant = "rectangular",
  className,
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full max-w-xs",
    circular: "rounded-full",
    rectangular: "rounded-md",
    card: "rounded-lg",
  };

  return (
    <div
      className={cn("skeleton", variantClasses[variant], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({
  className,
}: { className?: string }) {
  return (
    <div className={cn("card-base p-6 space-y-4 animate-pulse", className)}>
      <SkeletonComponent className="h-32 w-full" variant="card" />
      <div className="space-y-3">
        <SkeletonComponent variant="text" className="w-3/4" />
        <SkeletonComponent variant="text" className="w-1/2" />
        <SkeletonComponent variant="text" className="w-5/6" />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <SkeletonComponent variant="circular" className="h-6 w-20" />
        <SkeletonComponent variant="circular" className="h-6 w-24" />
        <SkeletonComponent variant="circular" className="h-6 w-16" />
      </div>
    </div>
  );
}

export function SkeletonGrid({
  count = 6,
  className,
}: { count?: number; className?: string }) {
  return (
    <div className={cn("grid-auto-fit", className)}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList({
  count = 5,
  className,
}: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <SkeletonComponent variant="circular" className="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <SkeletonComponent variant="text" className="w-1/3" />
            <SkeletonComponent variant="text" className="w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}