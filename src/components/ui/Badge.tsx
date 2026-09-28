import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "success" | "warning" | "neutral" | "danger";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
  icon,
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full shrink-0 tracking-wide";

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 gap-1",
    md: "text-xs px-3 py-1 gap-1.5",
  };

  const variantStyles = {
    primary: "bg-[#0f2744]/10 text-[#0f2744] border border-[#0f2744]/20",
    accent: "bg-[#e0521c]/10 text-[#e0521c] border border-[#e0521c]/20",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
