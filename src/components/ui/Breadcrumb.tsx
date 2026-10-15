"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    isCurrentPage?: boolean;
  }>;
  className?: string;
  separator?: React.ReactNode;
}

export function Breadcrumb({
  items,
  className,
  separator = <ChevronRight className="h-4 w-4" />,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-2", className)}>
      <ol className="flex items-center space-x-2" role="list">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center space-x-2">
            {index > 0 && (
              <span className="text-muted-foreground" aria-hidden="true">
                {separator}
              </span>
            )}
            {item.isCurrentPage || index === items.length - 1 ? (
              <span
                aria-current={item.isCurrentPage || index === items.length - 1 ? "page" : undefined}
                className="text-foreground font-medium truncate max-w-[200px]"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
  children?: React.ReactNode;
}

export function BreadcrumbItem({
  label,
  href,
  isCurrentPage,
  children,
}: BreadcrumbItemProps) {
  return (
    <li className="flex items-center space-x-2">
      {href && !isCurrentPage ? (
        <Link
          href={href}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {label}
        </Link>
      ) : (
        <span
          aria-current={isCurrentPage ? "page" : undefined}
          className={cn(
            isCurrentPage ? "text-foreground font-medium" : "text-sm text-muted-foreground"
          )}
        >
          {label}
        </span>
      )}
      {children}
    </li>
  );
}

export function BreadcrumbLink({
  href,
  children,
  className,
  asChild = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) {
  if (asChild) {
    return (
      <Link href={href} className={cn("text-sm text-muted-foreground hover:text-foreground transition-colors", className)}>
        {children}
      </Link>
    );
  }
  
  return (
    <a
      href={href}
      className={cn("text-sm text-muted-foreground hover:text-foreground transition-colors", className)}
    >
      {children}
    </a>
  );
}

export function BreadcrumbPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-sm text-foreground font-medium truncate", className)}>
      {children}
    </span>
  );
}

export function BreadcrumbSeparator({
  children = <ChevronRight className="h-4 w-4" />,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-muted-foreground", className)} aria-hidden="true">
      {children}
    </span>
  );
}