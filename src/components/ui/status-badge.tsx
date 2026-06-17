import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "info" | "neutral" | "accent";

const badgeStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-400/20",
  warning: "bg-amber-500/10 text-amber-200 ring-1 ring-amber-400/20",
  info: "bg-blue-500/10 text-blue-200 ring-1 ring-blue-400/20",
  neutral: "bg-slate-500/10 text-slate-200 ring-1 ring-slate-400/10",
  accent: "bg-gold-400/15 text-gold-100 ring-1 ring-gold-300/30",
};

interface StatusBadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export function StatusBadge({
  variant = "info",
  className,
  children,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        badgeStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
