"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch React errors and display fallback UI
 * Prevents entire app from crashing when a component throws an error
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error);
      console.error("Error info:", info);
    }

    // Call optional callback
    this.props.onError?.(error, info);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="mx-4 max-w-md rounded-lg border border-red-700 bg-red-950/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-lg font-semibold text-foreground">
                Oops! Something went wrong
              </h2>
            </div>

            <p className="mb-4 text-sm text-foreground/80">
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-4 rounded bg-black/30 p-3">
                <p className="text-xs font-mono text-red-300 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.resetError}
              className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Separate error boundary for specific sections
 * Prevents errors in one component from affecting the whole page
 */
export function SectionErrorBoundary({
  children,
  section = "Section",
}: {
  children: React.ReactNode;
  section?: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="rounded border border-yellow-700 bg-yellow-950/20 p-4">
          <p className="text-sm text-yellow-200">
            {section} encountered an error and couldn't be loaded. Please
            refresh the page.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
