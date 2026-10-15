import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "free" | "premium" | "external" | "new" | "version" | "default";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantClasses = {
    free: "badge-free",
    premium: "badge-premium",
    external: "badge-external",
    new: "badge-new",
    version: "badge-version",
    default: "badge badge-version",
  };

  return (
    <span className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
}