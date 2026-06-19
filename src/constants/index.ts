/**
 * Application constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Stellar Network
export const STELLAR_CONFIG = {
  NETWORK: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet",
  HORIZON_URL:
    process.env.NEXT_PUBLIC_HORIZON_URL ||
    "https://horizon-testnet.stellar.org",
  SOROBAN_RPC_URL:
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
    "https://soroban-testnet.stellar.org",
} as const;

// UI Constants
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 500,
  PAGINATION_SIZE: 12,
  SEARCH_MIN_LENGTH: 2,
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  MARKETPLACE: "/marketplace",
  LIST_PROPERTY: "/list",
  DASHBOARD: "/dashboard",
  PORTAL: "/portal",
  PROPERTY_DETAIL: (id: string) => `/property/${id}`,
  PROPERTY_CHECKOUT: (id: string) => `/property/${id}/checkout`,
  DISPUTES: "/disputes",
} as const;

// User Roles
export const USER_ROLES = {
  TENANT: "tenant",
  LANDLORD: "landlord",
  ADMIN: "admin",
} as const;

// Listing Status
export const LISTING_STATUS = {
  AVAILABLE: "available",
  RENTED: "rented",
  PENDING: "pending",
} as const;

// Lease Status
export const LEASE_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  COMPLETED: "completed",
  DISPUTED: "disputed",
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  TRANSFER: "transfer",
  REFUND: "refund",
} as const;

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  FAILED: "failed",
} as const;

// Dispute Status
export const DISPUTE_STATUS = {
  OPEN: "open",
  IN_REVIEW: "in_review",
  RESOLVED: "resolved",
} as const;

// Currency
export const CURRENCIES = {
  USD: "USD",
  USDC: "USDC",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please try again later.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  INVALID_INPUT: "Please check your input and try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  WALLET_NOT_CONNECTED: "Please connect your wallet to continue.",
  INVALID_AMOUNT: "Please enter a valid amount.",
  INSUFFICIENT_BALANCE: "Insufficient balance for this transaction.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROPERTY_LISTED: "Property listed successfully!",
  PAYMENT_COMPLETED: "Payment completed successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  DISPUTE_CREATED: "Dispute created successfully!",
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  WALLET_ADDRESS: /^G[A-Z2-7]{55}$/,
  PHONE: /^[0-9]{10,}$/,
  URL: /^https?:\/\/.+/,
  POSITIVE_NUMBER: /^\d+(\.\d{1,2})?$/,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
} as const;

// Amenities
export const AMENITIES = [
  "WiFi",
  "Parking",
  "Gym",
  "Pool",
  "Laundry",
  "AC",
  "Heating",
  "Balcony",
  "Garden",
  "Elevator",
  "Security",
  "Pet-friendly",
] as const;

// Badges
export const REPUTATION_BADGES = {
  VERIFIED: "verified",
  TRUSTED: "trusted",
  RESPONSIVE: "responsive",
  CLEAN: "clean",
  COMMUNICATIVE: "communicative",
} as const;
