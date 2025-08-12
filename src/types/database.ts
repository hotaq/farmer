// Simplified type definitions for rule-based MVP
// No database dependencies - using local storage and in-memory data

export interface User {
  id: string;
  email: string;
  fullName: string;
  userType: 'producer' | 'partner';
  phone?: string;
  location?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'meat' | 'herbs' | 'nuts' | 'other';
  price: number;
  unit: string;
  availableQuantity: number;
  minimumOrder?: number;
  harvestDate?: string;
  expiryDate?: string;
  location: string;
  organic: boolean;
  images: string[];
  status: 'active' | 'inactive' | 'sold_out';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  deliveryAddress: string;
  deliveryDate: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  participant1: string;
  participant2: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

// Type aliases for compatibility
export type UserRole = 'producer' | 'partner';
export type ProductCategory = 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'meat' | 'herbs' | 'nuts' | 'other';
export type ProductStatus = 'active' | 'inactive' | 'sold_out';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

// Legacy compatibility types
export type Profile = User;
export type UserProfile = User;

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API response interfaces
export interface AuthResponse {
  user?: User;
  error?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}