/**
 * Form validation utilities
 */

import { VALIDATION_PATTERNS, ERROR_MESSAGES } from "@/constants";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }
  return { isValid: true };
}

/**
 * Password validation
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }
  return { isValid: true };
}

/**
 * Stellar wallet address validation
 */
export function validateWalletAddress(address: string): ValidationResult {
  if (!address) {
    return { isValid: false, error: "Wallet address is required" };
  }
  if (!VALIDATION_PATTERNS.WALLET_ADDRESS.test(address)) {
    return { isValid: false, error: "Invalid Stellar wallet address" };
  }
  return { isValid: true };
}

/**
 * Phone number validation
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }
  if (!VALIDATION_PATTERNS.PHONE.test(phone)) {
    return {
      isValid: false,
      error: "Invalid phone number format (must be at least 10 digits)",
    };
  }
  return { isValid: true };
}

/**
 * URL validation
 */
export function validateURL(url: string): ValidationResult {
  if (!url) {
    return { isValid: false, error: "URL is required" };
  }
  if (!VALIDATION_PATTERNS.URL.test(url)) {
    return { isValid: false, error: "Invalid URL format" };
  }
  return { isValid: true };
}

/**
 * Required field validation
 */
export function validateRequired(value: string | null | undefined): ValidationResult {
  if (!value || value.trim() === "") {
    return { isValid: false, error: "This field is required" };
  }
  return { isValid: true };
}

/**
 * Min length validation
 */
export function validateMinLength(
  value: string,
  minLength: number
): ValidationResult {
  if (!value) {
    return { isValid: false, error: "This field is required" };
  }
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `Minimum length is ${minLength} characters`,
    };
  }
  return { isValid: true };
}

/**
 * Max length validation
 */
export function validateMaxLength(
  value: string,
  maxLength: number
): ValidationResult {
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `Maximum length is ${maxLength} characters`,
    };
  }
  return { isValid: true };
}

/**
 * Numeric validation
 */
export function validateNumber(value: string | number): ValidationResult {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_INPUT };
  }

  return { isValid: true };
}

/**
 * Positive number validation
 */
export function validatePositiveNumber(
  value: string | number
): ValidationResult {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue) || numValue <= 0) {
    return { isValid: false, error: "Must be a positive number" };
  }

  return { isValid: true };
}

/**
 * Min value validation
 */
export function validateMinValue(
  value: number,
  minValue: number
): ValidationResult {
  if (value < minValue) {
    return { isValid: false, error: `Minimum value is ${minValue}` };
  }
  return { isValid: true };
}

/**
 * Max value validation
 */
export function validateMaxValue(
  value: number,
  maxValue: number
): ValidationResult {
  if (value > maxValue) {
    return { isValid: false, error: `Maximum value is ${maxValue}` };
  }
  return { isValid: true };
}

/**
 * Match field validation (e.g., confirm password)
 */
export function validateMatch(value: string, compareValue: string): ValidationResult {
  if (value !== compareValue) {
    return { isValid: false, error: "Values do not match" };
  }
  return { isValid: true };
}

/**
 * Custom regex validation
 */
export function validatePattern(
  value: string,
  pattern: RegExp,
  errorMessage = "Invalid format"
): ValidationResult {
  if (!pattern.test(value)) {
    return { isValid: false, error: errorMessage };
  }
  return { isValid: true };
}

/**
 * Property listing form validation
 */
export function validatePropertyForm(data: {
  title?: string;
  address?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
}): FormErrors {
  const errors: FormErrors = {};

  if (!data.title || data.title.trim() === "") {
    errors.title = "Title is required";
  }

  if (!data.address || data.address.trim() === "") {
    errors.address = "Address is required";
  }

  if (!data.price || data.price <= 0) {
    errors.price = "Price must be greater than 0";
  }

  if (!data.bedrooms || data.bedrooms < 0) {
    errors.bedrooms = "Invalid number of bedrooms";
  }

  if (!data.bathrooms || data.bathrooms < 0) {
    errors.bathrooms = "Invalid number of bathrooms";
  }

  if (!data.description || data.description.trim() === "") {
    errors.description = "Description is required";
  }

  return errors;
}

/**
 * Lease agreement form validation
 */
export function validateLeaseForm(data: {
  startDate?: string;
  endDate?: string;
  monthlyRent?: number;
  depositAmount?: number;
}): FormErrors {
  const errors: FormErrors = {};

  if (!data.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!data.endDate) {
    errors.endDate = "End date is required";
  }

  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (start >= end) {
      errors.endDate = "End date must be after start date";
    }
  }

  if (!data.monthlyRent || data.monthlyRent <= 0) {
    errors.monthlyRent = "Monthly rent must be greater than 0";
  }

  if (!data.depositAmount || data.depositAmount < 0) {
    errors.depositAmount = "Deposit amount cannot be negative";
  }

  return errors;
}

/**
 * Validate form and return only fields with errors
 */
export function validateForm(
  data: Record<string, unknown>,
  schema: Record<string, (value: unknown) => ValidationResult>
): FormErrors {
  const errors: FormErrors = {};

  Object.entries(schema).forEach(([key, validator]) => {
    const result = validator(data[key]);
    if (!result.isValid) {
      errors[key] = result.error;
    }
  });

  return errors;
}

/**
 * Check if form has any errors
 */
export function hasFormErrors(errors: FormErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}

/**
 * Clear specific form error
 */
export function clearFormError(
  errors: FormErrors,
  fieldName: string
): FormErrors {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
}

/**
 * Sanitize form input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/<[^>]*>/g, "");
}

/**
 * Sanitize form object
 */
export function sanitizeFormData(
  data: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
}
