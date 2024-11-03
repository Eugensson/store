import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ children, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "w-fit px-2 py-1 bg-primary text-xs text-primary-foreground",
        className
      )}
    >
      {children}
    </span>
  );
};
