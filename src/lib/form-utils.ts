import { z } from 'zod';
import { UseFormReturn, FieldPath } from 'react-hook-form';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number');
export const priceSchema = z.number().positive('Price must be greater than 0');
export const quantitySchema = z.number().positive('Quantity must be greater than 0');

// User role enum
export const UserRole = z.enum(['producer', 'partner']);
export type UserRoleType = z.infer<typeof UserRole>;

// User registration schema
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: UserRole,
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

// User login schema
export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type UserLoginData = z.infer<typeof userLoginSchema>;

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// Product categories
export const ProductCategory = z.enum([
  'vegetables',
  'fruits',
  'grains',
  'dairy',
  'meat',
  'herbs',
  'nuts',
  'other'
]);

export type ProductCategoryType = z.infer<typeof ProductCategory>;

// Product listing schema
export const productListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  category: ProductCategory,
  price: priceSchema,
  unit: z.string().min(1, 'Unit is required'), // kg, ton, piece, etc.
  availableQuantity: quantitySchema,
  minimumOrder: quantitySchema.optional(),
  harvestDate: z.date().optional(),
  expiryDate: z.date().optional(),
  location: z.string().min(2, 'Location is required'),
  organic: z.boolean().default(false),
  images: z.array(z.string()).min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
});

export type ProductListingData = z.infer<typeof productListingSchema>;

// Message schema
export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message must be less than 1000 characters'),
  chatId: z.string().uuid('Invalid chat ID'),
});

export type MessageData = z.infer<typeof messageSchema>;

// Order schema
export const orderSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: quantitySchema,
  pricePerUnit: priceSchema,
  totalAmount: priceSchema,
  deliveryAddress: z.string().min(10, 'Please provide a complete delivery address'),
  deliveryDate: z.date().min(new Date(), 'Delivery date must be in the future'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export type OrderData = z.infer<typeof orderSchema>;

// Form utility functions
export function getFormErrorMessage<T extends Record<string, unknown>>(form: UseFormReturn<T>, fieldName: FieldPath<T>): string | undefined {
  const error = form.formState.errors[fieldName];
  return error?.message as string | undefined;
}

export function hasFormError<T extends Record<string, unknown>>(form: UseFormReturn<T>, fieldName: FieldPath<T>): boolean {
  return !!form.formState.errors[fieldName];
}

// File validation utilities
export function validateFileSize(file: File, maxSizeInMB: number = 5): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

export function validateFileType(file: File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']): boolean {
  return allowedTypes.includes(file.type);
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!validateFileType(file)) {
    return { isValid: false, error: 'Please upload a valid image file (JPEG, PNG, or WebP)' };
  }
  
  if (!validateFileSize(file, 5)) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }
  
  return { isValid: true };
}

// Format utilities for display
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

export function formatQuantity(quantity: number, unit: string): string {
  return `${quantity} ${unit}${quantity !== 1 ? 's' : ''}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}