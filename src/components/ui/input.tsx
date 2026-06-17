"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

const inputStyles = "w-full rounded-2xl border border-blue-800/90 bg-blue-900/80 px-4 py-3 text-sm text-foreground placeholder:text-blue-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, type = "text", id, ...props }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 10)}`;

    return (
      <div className={cn("space-y-2", className)}>
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={inputStyles}
          {...props}
        />
        {hint ? <p className="text-xs text-blue-300">{hint}</p> : null}
      </div>
    );
  },
);
Input.displayName = "Input";
