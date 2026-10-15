import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export function Separator({ className, orientation = "horizontal", decorative = true, ...props }: SeparatorProps) {
  return (
    <hr
      className={cn(
        "divider",
        orientation === "vertical" ? "w-px h-12" : "h-px w-full",
        className
      )}
      aria-orientation={orientation}
      role={decorative ? "none" : "separator"}
      {...props}
    />
  );
}