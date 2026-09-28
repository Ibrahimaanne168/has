import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "ghost" | "danger" | "secondary";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md";

    const variantStyles = {
      primary:
        "bg-[#0f2744] hover:bg-[#183a62] text-white shadow-sm focus:ring-[#0f2744]/40 active:bg-[#0a1a2e]",
      accent:
        "bg-[#e0521c] hover:bg-[#ba3d14] text-white shadow-sm focus:ring-[#e0521c]/40 active:bg-[#943317]",
      secondary:
        "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-300",
      outline:
        "border border-[#0f2744] text-[#0f2744] hover:bg-[#0f2744]/5 focus:ring-[#0f2744]/20",
      ghost:
        "text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500/40",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-2.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
