/**
 * API Service Layer
 * Centralized API client for all HTTP requests
 */

import { API_CONFIG, ERROR_MESSAGES } from "@/constants";
import type { ApiResponse } from "@/types";

class APIClient {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(
    baseURL = API_CONFIG.BASE_URL,
    timeout = API_CONFIG.TIMEOUT,
    retryAttempts = API_CONFIG.RETRY_ATTEMPTS,
    retryDelay = API_CONFIG.RETRY_DELAY
  ) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;
  }

  /**
   * Make a fetch request with error handling and retries
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt = 0
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.timeout
      );

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
        }
        if (response.status === 404) {
          throw new Error(ERROR_MESSAGES.NOT_FOUND);
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: new Date(),
      };
    } catch (error) {
      // Retry on network errors, not on client errors
      if (
        attempt < this.retryAttempts &&
        error instanceof Error &&
        !error.message.includes("401") &&
        !error.message.includes("404")
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay * Math.pow(2, attempt))
        );
        return this.request<T>(endpoint, options, attempt + 1);
      }

      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;

      return {
        success: false,
        error: errorMessage,
        timestamp: new Date(),
      };
    }
  }

  /**
   * GET request
   */
  public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  /**
   * POST request
   */
  public async post<T>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  public async put<T>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  public async patch<T>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
  }

  /**
   * Get default headers
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Set authentication token
   */
  public setAuthToken(token: string | null) {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;

/**
 * Specific API endpoints
 */

export const propertiesAPI = {
  list: (filters?: Record<string, unknown>) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get(`/properties${query}`);
  },

  getById: (id: string) => apiClient.get(`/properties/${id}`),

  create: (data: unknown) => apiClient.post("/properties", data),

  update: (id: string, data: unknown) =>
    apiClient.put(`/properties/${id}`, data),

  delete: (id: string) => apiClient.delete(`/properties/${id}`),

  search: (query: string) => apiClient.get(`/properties/search?q=${query}`),
};

export const leasesAPI = {
  list: () => apiClient.get("/leases"),

  getById: (id: string) => apiClient.get(`/leases/${id}`),

  create: (data: unknown) => apiClient.post("/leases", data),

  update: (id: string, data: unknown) => apiClient.put(`/leases/${id}`, data),

  delete: (id: string) => apiClient.delete(`/leases/${id}`),
};

export const escrowAPI = {
  list: () => apiClient.get("/escrow"),

  getById: (id: string) => apiClient.get(`/escrow/${id}`),

  create: (data: unknown) => apiClient.post("/escrow", data),

  release: (id: string) => apiClient.post(`/escrow/${id}/release`),

  dispute: (id: string) => apiClient.post(`/escrow/${id}/dispute`),
};

export const transactionsAPI = {
  list: () => apiClient.get("/transactions"),

  getById: (id: string) => apiClient.get(`/transactions/${id}`),

  create: (data: unknown) => apiClient.post("/transactions", data),
};

export const disputesAPI = {
  list: () => apiClient.get("/disputes"),

  getById: (id: string) => apiClient.get(`/disputes/${id}`),

  create: (data: unknown) => apiClient.post("/disputes", data),

  resolve: (id: string, resolution: unknown) =>
    apiClient.put(`/disputes/${id}/resolve`, resolution),
};

export const authAPI = {
  login: (credentials: unknown) => apiClient.post("/auth/login", credentials),

  logout: () => apiClient.post("/auth/logout"),

  getCurrentUser: () => apiClient.get("/auth/me"),

  updateProfile: (data: unknown) => apiClient.put("/auth/profile", data),
};

export const reputationAPI = {
  getScore: (userId: string) => apiClient.get(`/reputation/${userId}`),

  addReview: (userId: string, review: unknown) =>
    apiClient.post(`/reputation/${userId}/review`, review),
};
