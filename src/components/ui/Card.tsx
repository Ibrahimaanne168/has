import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function Card({ children, className = "", hoverEffect = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#111821] text-slate-900 dark:text-[#F5F7FA] rounded-xl border border-slate-200/90 dark:border-[#263241] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_2px_10px_-2px_rgba(0,0,0,0.4)] ${
        hoverEffect
          ? "transition-all duration-200 hover:shadow-md hover:border-slate-300/90 hover:-translate-y-0.5 dark:hover:border-[#38495d] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
          : ""
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
    <div className={`p-5 sm:p-6 border-b border-slate-100/90 dark:border-[#263241] ${className}`}>
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
    <div className={`p-4 sm:p-5 bg-slate-50/60 dark:bg-[#151D27] border-t border-slate-100/90 dark:border-[#263241] rounded-b-xl ${className}`}>
      {children}
    </div>
  );
}
