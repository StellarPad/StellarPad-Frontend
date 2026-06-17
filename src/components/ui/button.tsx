"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps } from "react";

const variantStyles = {
  primary:
    "bg-primary text-white shadow-lg shadow-blue-900/20 hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-blue-400",
  secondary:
    "bg-blue-900/90 text-white hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-400",
  outline:
    "border border-blue-700 bg-transparent text-foreground hover:bg-blue-900/70 focus-visible:ring-2 focus-visible:ring-blue-400",
  ghost:
    "bg-transparent text-blue-100 hover:bg-blue-900/50 focus-visible:ring-2 focus-visible:ring-blue-400",
};

const sizeStyles = {
  sm: "h-9 rounded-lg px-3 text-sm",
  md: "h-11 rounded-xl px-4 text-sm font-semibold",
  lg: "h-12 rounded-2xl px-6 text-base font-semibold",
};

type ButtonVariant = keyof typeof variantStyles;
type ButtonSize = keyof typeof sizeStyles;

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = BaseButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
type LinkButtonProps = BaseButtonProps & DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
  href: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: ButtonProps | LinkButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 disabled:pointer-events-none disabled:opacity-60",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (typeof href === "string") {
    return (
      <Link href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
