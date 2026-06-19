"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  maxItems?: number;
}

/**
 * Breadcrumb Navigation Component
 * Shows the current location in the app hierarchy
 */
export function Breadcrumb({
  items,
  className = "",
  showHome = true,
  maxItems = 5,
}: BreadcrumbProps) {
  const pathname = usePathname();
  const [autoItems, setAutoItems] = React.useState<BreadcrumbItem[]>([]);

  // Auto-generate breadcrumbs from pathname if items not provided
  React.useEffect(() => {
    if (!items) {
      const segments = pathname
        .split("/")
        .filter((segment) => segment.length > 0);

      const generated: BreadcrumbItem[] = [];

      if (showHome) {
        generated.push({ label: "Home", href: "/" });
      }

      segments.forEach((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        generated.push({
          label,
          href,
          isActive: index === segments.length - 1,
        });
      });

      setAutoItems(generated);
    }
  }, [pathname, items, showHome]);

  const breadcrumbs = items || autoItems;

  // Limit breadcrumbs to maxItems
  let displayItems = breadcrumbs;
  if (breadcrumbs.length > maxItems) {
    displayItems = [
      breadcrumbs[0],
      { label: "...", isActive: false },
      ...breadcrumbs.slice(-(maxItems - 1)),
    ];
  }

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      <ol className="flex items-center gap-2">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-blue-400 flex-shrink-0" />
            )}

            {item.href && !item.isActive ? (
              <Link
                href={item.href}
                className="text-blue-400 hover:text-foreground transition-colors duration-200 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  item.label === "..."
                    ? "text-blue-400"
                    : "text-foreground font-medium"
                }
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Breadcrumb with home icon
 */
export function BreadcrumbWithIcon({
  items,
  className = "",
  maxItems = 5,
}: BreadcrumbProps) {
  const pathname = usePathname();
  const [autoItems, setAutoItems] = React.useState<BreadcrumbItem[]>([]);

  React.useEffect(() => {
    if (!items) {
      const segments = pathname
        .split("/")
        .filter((segment) => segment.length > 0);

      const generated: BreadcrumbItem[] = [];

      segments.forEach((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        generated.push({
          label,
          href,
          isActive: index === segments.length - 1,
        });
      });

      setAutoItems(generated);
    }
  }, [pathname, items]);

  const breadcrumbs = items || autoItems;

  let displayItems = breadcrumbs;
  if (breadcrumbs.length > maxItems) {
    displayItems = [
      ...breadcrumbs.slice(-(maxItems - 1)),
    ];
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2">
        <li>
          <Link
            href="/"
            className="text-blue-400 hover:text-foreground transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-blue-400 flex-shrink-0" />

            {item.href && !item.isActive ? (
              <Link
                href={item.href}
                className="text-sm text-blue-400 hover:text-foreground transition-colors hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm text-foreground font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Breadcrumb component for the page header
 */
export function PageBreadcrumb({ items }: { items?: BreadcrumbItem[] }) {
  return (
    <div className="mb-6">
      <Breadcrumb items={items} className="text-xs sm:text-sm" />
    </div>
  );
}
