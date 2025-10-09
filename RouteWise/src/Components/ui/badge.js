import React from 'react';
import { clsx } from 'clsx';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    secondary: "bg-slate-100 text-slate-800 border-slate-200",
    destructive: "bg-red-100 text-red-800 border-red-200",
    outline: "border border-slate-200 text-slate-700"
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };