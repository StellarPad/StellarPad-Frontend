"use client";

import React from "react";

/**
 * Skeleton - Generic skeleton loading component
 */
export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-blue-800/50 ${className}`}
      {...props}
    />
  );
}

/**
 * CardSkeleton - Skeleton for property cards
 */
export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-blue-800 bg-blue-950/50 overflow-hidden p-4">
      <Skeleton className="h-48 w-full mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  );
}

/**
 * PropertyGridSkeleton - Skeleton for property grid loading
 */
export function PropertyGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * TextSkeleton - Skeleton for text content
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
        />
      ))}
    </div>
  );
}

/**
 * TableSkeleton - Skeleton for table loading
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="border border-blue-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-blue-800 bg-blue-950/50 p-4 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="border-b border-blue-800 p-4 flex gap-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * FormSkeleton - Skeleton for form loading
 */
export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-full mt-6" />
    </div>
  );
}

/**
 * AvatarSkeleton - Skeleton for avatar images
 */
export function AvatarSkeleton() {
  return <Skeleton className="h-10 w-10 rounded-full" />;
}

/**
 * DashboardSkeleton - Skeleton for dashboard layout
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-blue-800 bg-blue-950/50 p-4"
          >
            <Skeleton className="h-4 w-1/2 mb-3" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-blue-800 bg-blue-950/50 p-4">
        <Skeleton className="h-4 w-1/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>

      {/* Table */}
      <div>
        <Skeleton className="h-4 w-1/4 mb-4" />
        <TableSkeleton rows={5} columns={4} />
      </div>
    </div>
  );
}

/**
 * DetailPageSkeleton - Skeleton for detail page loading
 */
export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <Skeleton className="h-96 w-full rounded-lg" />

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <TextSkeleton lines={5} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * LoadingSpinner - Animated loading spinner
 */
export function LoadingSpinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 border-blue-400 border-t-blue-900 ${sizeClasses[size]} ${className}`}
    />
  );
}

/**
 * LoadingOverlay - Full-screen loading overlay
 */
export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="rounded-lg bg-blue-950 p-6 text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-foreground">{message}</p>
      </div>
    </div>
  );
}
