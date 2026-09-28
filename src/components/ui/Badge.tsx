import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "success" | "warning" | "neutral" | "danger";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
  uppercase?: boolean;
}

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
  icon,
  uppercase = false,
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-semibold rounded-lg shrink-0 transition-colors";

  const sizeStyles = {
    sm: `text-[10px] px-2 py-0.5 gap-1 ${uppercase ? "uppercase tracking-wider" : "tracking-normal"}`,
    md: `text-[11px] px-2.5 py-1 gap-1.5 ${uppercase ? "uppercase tracking-wider" : "tracking-normal"}`,
  };

  const variantStyles = {
    primary: "bg-[#0f2744]/8 text-[#0f2744] border border-[#0f2744]/20",
    accent: "bg-[#e0521c]/10 text-[#e0521c] border border-[#e0521c]/25",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200/90",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/90",
    danger: "bg-rose-50 text-rose-800 border border-rose-200/90",
    neutral: "bg-slate-100/80 text-slate-700 border border-slate-200/90",
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
