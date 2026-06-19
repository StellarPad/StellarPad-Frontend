/**
 * Core application types and interfaces
 */

// User and Authentication
export interface User {
  id: string;
  address: string;
  name?: string;
  email?: string;
  role: "tenant" | "landlord" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Property and Listing
export interface PropertyListing {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  pricePerMonth: number;
  currency: "USD" | "USDC";
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  amenities: string[];
  images: string[];
  landlordId: string;
  createdAt: Date;
  updatedAt: Date;
  status: "available" | "rented" | "pending";
}

// Lease and Escrow
export interface LeaseAgreement {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  depositAmount: number;
  terms: string;
  status: "pending" | "active" | "completed" | "disputed";
  escrowId?: string;
}

export interface EscrowAccount {
  id: string;
  leaseId: string;
  balance: number;
  currency: "USD" | "USDC";
  status: "active" | "released" | "disputed";
  createdAt: Date;
  updatedAt: Date;
}

// Transaction
export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer" | "refund";
  amount: number;
  currency: string;
  status: "pending" | "confirmed" | "failed";
  txHash?: string;
  createdAt: Date;
}

// Dispute
export interface Dispute {
  id: string;
  leaseId: string;
  initiatedBy: string;
  title: string;
  description: string;
  status: "open" | "in_review" | "resolved";
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Reputation
export interface ReputationScore {
  userId: string;
  score: number;
  totalReviews: number;
  averageRating: number;
  badges: string[];
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Dashboard Analytics
export interface DashboardStats {
  totalListings?: number;
  activeLeases?: number;
  totalEarnings?: number;
  pendingPayments?: number;
  disputes?: number;
}
