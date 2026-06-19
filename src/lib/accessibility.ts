/**
 * Accessibility Utilities
 * Helpers for improving app accessibility and WCAG compliance
 */

/**
 * Skip to main content link utility
 * Allows keyboard users to skip repetitive navigation
 */
export function createSkipLink(): JSX.Element {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:bg-blue-600 focus:text-white focus:p-2 focus:rounded"
    >
      Skip to main content
    </a>
  );
}

/**
 * Announce important updates to screen readers
 */
export class AriaAnnouncer {
  private announceElement: HTMLDivElement | null = null;

  constructor() {
    if (typeof document !== "undefined") {
      this.announceElement = document.createElement("div");
      this.announceElement.setAttribute("aria-live", "polite");
      this.announceElement.setAttribute("aria-atomic", "true");
      this.announceElement.className = "sr-only";
      this.announceElement.id = "aria-announcer";
      document.body.appendChild(this.announceElement);
    }
  }

  announce(message: string) {
    if (this.announceElement) {
      this.announceElement.textContent = message;
    }
  }

  assertive(message: string) {
    if (this.announceElement) {
      this.announceElement.setAttribute("aria-live", "assertive");
      this.announceElement.textContent = message;
      setTimeout(() => {
        if (this.announceElement) {
          this.announceElement.setAttribute("aria-live", "polite");
        }
      }, 1000);
    }
  }

  destroy() {
    if (this.announceElement && this.announceElement.parentNode) {
      this.announceElement.parentNode.removeChild(this.announceElement);
      this.announceElement = null;
    }
  }
}

export const ariaAnnouncer = new AriaAnnouncer();

/**
 * Check if keyboard navigation is active
 */
let isKeyboardNavigating = false;

export function isKeyboardUser(): boolean {
  return isKeyboardNavigating;
}

// Detect keyboard navigation
if (typeof window !== "undefined") {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      isKeyboardNavigating = true;
    }
  });

  document.addEventListener("mousedown", () => {
    isKeyboardNavigating = false;
  });
}

/**
 * Generate accessible label for form inputs
 */
export function generateAccessibleLabel(
  fieldName: string,
  required: boolean = false
): string {
  const label = fieldName
    .split(/(?=[A-Z])/)
    .join(" ")
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase());

  return required ? `${label} (required)` : label;
}

/**
 * Get accessible error message
 */
export function getAccessibleErrorMessage(fieldName: string, error: string): string {
  return `${fieldName} error: ${error}`;
}

/**
 * Focus management for modals
 */
export class FocusTrap {
  private focusableElements: HTMLElement[] = [];
  private firstElement: HTMLElement | null = null;
  private lastElement: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    this.focusableElements = Array.from(
      element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    this.firstElement = this.focusableElements[0] || element;
    this.lastElement =
      this.focusableElements[this.focusableElements.length - 1] || element;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    element.addEventListener("keydown", this.handleKeyDown);
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === this.firstElement) {
          e.preventDefault();
          this.lastElement?.focus();
        }
      } else {
        if (document.activeElement === this.lastElement) {
          e.preventDefault();
          this.firstElement?.focus();
        }
      }
    }
  }

  destroy() {
    // Clean up would happen here
  }
}

/**
 * ARIA label helper for common patterns
 */
export const ariaLabels = {
  close: "Close dialog",
  open: "Open menu",
  next: "Next page",
  previous: "Previous page",
  loading: "Loading content",
  search: "Search",
  submit: "Submit form",
  cancel: "Cancel",
  confirm: "Confirm",
  delete: "Delete",
  edit: "Edit",
  save: "Save changes",
  settings: "Settings",
  logout: "Logout",
} as const;

/**
 * Generate accessible button attributes
 */
export interface AccessibleButtonProps {
  "aria-label": string;
  "aria-pressed"?: boolean;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: string;
  disabled?: boolean;
}

export function getAccessibleButtonProps(
  action: keyof typeof ariaLabels,
  additionalProps?: Partial<AccessibleButtonProps>
): AccessibleButtonProps {
  return {
    "aria-label": ariaLabels[action],
    ...additionalProps,
  };
}

/**
 * Color contrast checker for accessibility
 */
export function checkColorContrast(
  foreground: string,
  background: string
): {
  ratio: number;
  meetsWCAG_AA: boolean;
  meetsWCAG_AAA: boolean;
} {
  const getLuminance = (hex: string): number => {
    const [r, g, b] = hex
      .match(/\w\w/g)!
      .map((x) => parseInt(x, 16) / 255);

    const [rs, gs, bs] = [r, g, b].map((val) =>
      val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    meetsWCAG_AA: ratio >= 4.5, // 4.5:1 for normal text
    meetsWCAG_AAA: ratio >= 7, // 7:1 for enhanced contrast
  };
}

/**
 * Accessible table utilities
 */
export function getAccessibleTableProps() {
  return {
    role: "table",
    "aria-label": "Data table",
    "aria-describedby": "table-description",
  };
}

/**
 * Accessible form utilities
 */
export function getAccessibleFormProps(description?: string) {
  return {
    role: "form",
    "aria-describedby": description ? "form-description" : undefined,
  };
}

/**
 * Accessible loading state
 */
export function getAccessibleLoadingProps() {
  return {
    "aria-busy": true,
    "aria-label": "Loading",
  };
}

/**
 * Accessible error state
 */
export function getAccessibleErrorProps(errorId: string) {
  return {
    "aria-invalid": true,
    "aria-describedby": errorId,
  };
}

/**
 * Announce navigation to screen readers
 */
export function announcePageNavigation(pageTitle: string) {
  ariaAnnouncer.announce(`Navigated to ${pageTitle}`);
}

/**
 * Announce form submission
 */
export function announceFormSubmission(success: boolean, message?: string) {
  const announcement = success
    ? `Form submitted successfully${message ? `. ${message}` : ""}`
    : `Form submission failed${message ? `. ${message}` : ""}`;

  ariaAnnouncer.assertive(announcement);
}

/**
 * Announce search results
 */
export function announceSearchResults(count: number, query: string) {
  const message =
    count === 0
      ? `No results found for "${query}"`
      : `Found ${count} result${count !== 1 ? "s" : ""} for "${query}"`;

  ariaAnnouncer.announce(message);
}
