import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "card";
}

export function Skeleton({ className, variant = "rectangular", ...props }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full max-w-xs",
    circular: "rounded-full",
    rectangular: "rounded-md",
    card: "rounded-lg",
  };

  return (
    <div
      className={cn("skeleton", variantClasses[variant], className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card-base p-6 space-y-4 animate-pulse">
      <Skeleton className="h-32 w-full" variant="card" />
      <div className="space-y-3">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
        <Skeleton variant="text" className="w-5/6" />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton variant="circular" className="h-6 w-20" />
        <Skeleton variant="circular" className="h-6 w-24" />
        <Skeleton variant="circular" className="h-6 w-16" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid-auto-fit">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}