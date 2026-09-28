import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function Card({ children, className = "", hoverEffect = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-slate-200/80 shadow-xs ${
        hoverEffect ? "transition-all duration-200 hover:shadow-md hover:border-slate-300" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-5 sm:p-6 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 sm:p-6 bg-slate-50/50 border-t border-slate-100 rounded-b-lg ${className}`}>
      {children}
    </div>
  );
}
