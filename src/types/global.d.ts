/**
 * Global Type Definitions
 * Extends and augments global types for the application
 */

// React and Next.js type enhancements
declare global {
  namespace React {
    interface FC<P = {}> {
      displayName?: string;
    }
  }

  // Window extensions
  interface Window {
    __NEXT_DATA__?: any;
    stellar?: any;
    xrpl?: any;
  }

  // Environment variables
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ENVIRONMENT: "development" | "staging" | "production";
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_HORIZON_URL: string;
      NEXT_PUBLIC_SOROBAN_RPC_URL: string;
      NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID?: string;
      NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
    }
  }
}

// Extended fetch with timeout
export interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

// Generic async state
export interface AsyncState<T, E = Error> {
  status: "idle" | "pending" | "success" | "error";
  data: T | null;
  error: E | null;
}

// Generic pagination
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Generic API response
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;
export type Falsy = false | 0 | "" | null | undefined;

// Promise helper types
export type Awaited<T> = T extends Promise<infer U> ? U : T;
export type PromiseValue<T> = T extends Promise<infer U> ? U : never;

// Function types
export type AsyncFunction<Args extends any[] = any[], Return = any> = (
  ...args: Args
) => Promise<Return>;

export type SyncFunction<Args extends any[] = any[], Return = any> = (
  ...args: Args
) => Return;

// Event handler types
export interface ChangeEvent {
  target: {
    name: string;
    value: string | number | boolean;
  };
}

export interface SubmitEvent {
  preventDefault(): void;
  currentTarget: HTMLFormElement;
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  role?: string;
  "aria-label"?: string;
}

// Common component patterns
export interface WithChildren {
  children: React.ReactNode;
}

export interface WithClassName {
  className?: string;
}

export interface WithId {
  id: string;
}

// Callback types
export type Callback<T = void> = () => T;
export type EventCallback<E = Event> = (event: E) => void;
export type DataCallback<T> = (data: T) => void;
export type ErrorCallback = (error: Error) => void;

// Form types
export interface FormFieldProps {
  name: string;
  value: string | number | boolean;
  onChange: (e: ChangeEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Local storage types
export interface StorageOptions {
  useSession?: boolean;
  encryptionKey?: string;
}

// Router types
export interface RouteParams {
  [key: string]: string | string[];
}

// Utility type for making all properties of T optional except those in K
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Utility type for making all properties of T required except those in K
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;

// Utility type for extracting promise type
export type ExtractPromise<T> = T extends Promise<infer U> ? U : T;

// Record type with string values
export type StringRecord = Record<string, string>;

// Record type with number values
export type NumberRecord = Record<string, number>;

// Record type with any values
export type AnyRecord = Record<string, any>;

// Deep partial type
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// Deep readonly type
export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
  : T;

// Merge object types
export type Merge<A, B> = Omit<A, keyof B> & B;

// Exclude property by value type
export type ExcludeByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

// Pick property by value type
export type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

// Object entries type
export type ObjectEntries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

// Export empty object declaration to make this a module
export {};
