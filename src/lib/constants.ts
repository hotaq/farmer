// Application constants and configuration

// App metadata
export const APP_NAME = 'Agri-Connect';
export const APP_DESCRIPTION = 'Connecting agricultural producers with business partners for direct trade, fair pricing, and sustainable farming partnerships.';
export const APP_VERSION = '1.0.0';

// URLs and endpoints
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Supabase configuration
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const SUPABASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'agri-connect-storage';

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES_PER_PRODUCT = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// User roles
export const USER_ROLES = {
  PRODUCER: 'producer',
  PARTNER: 'partner',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Product categories
export const PRODUCT_CATEGORIES = {
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  GRAINS: 'grains',
  DAIRY: 'dairy',
  MEAT: 'meat',
  HERBS: 'herbs',
  NUTS: 'nuts',
  OTHER: 'other',
} as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[keyof typeof PRODUCT_CATEGORIES];

// Product category labels
export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  [PRODUCT_CATEGORIES.VEGETABLES]: 'Vegetables',
  [PRODUCT_CATEGORIES.FRUITS]: 'Fruits',
  [PRODUCT_CATEGORIES.GRAINS]: 'Grains & Cereals',
  [PRODUCT_CATEGORIES.DAIRY]: 'Dairy Products',
  [PRODUCT_CATEGORIES.MEAT]: 'Meat & Poultry',
  [PRODUCT_CATEGORIES.HERBS]: 'Herbs & Spices',
  [PRODUCT_CATEGORIES.NUTS]: 'Nuts & Seeds',
  [PRODUCT_CATEGORIES.OTHER]: 'Other',
};

// Product status
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SOLD_OUT: 'sold_out',
} as const;

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

// Product status labels
export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  [PRODUCT_STATUS.ACTIVE]: 'Active',
  [PRODUCT_STATUS.INACTIVE]: 'Inactive',
  [PRODUCT_STATUS.SOLD_OUT]: 'Sold Out',
};

// Order status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Order status labels
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
};

// Common units for products
export const PRODUCT_UNITS = [
  'kg',
  'ton',
  'gram',
  'pound',
  'piece',
  'dozen',
  'liter',
  'gallon',
  'box',
  'bag',
  'bundle',
  'crate',
] as const;

export type ProductUnit = typeof PRODUCT_UNITS[number];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

// Search and filtering
export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_LENGTH = 2;

// Date formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Currency
export const DEFAULT_CURRENCY = 'USD';
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

// Navigation routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/[id]',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  MESSAGES: '/messages',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PRODUCER: {
    DASHBOARD: '/producer/dashboard',
    PRODUCTS: '/producer/products',
    ADD_PRODUCT: '/producer/products/add',
    EDIT_PRODUCT: '/producer/products/[id]/edit',
    ORDERS: '/producer/orders',
    PROFILE: '/producer/profile',
  },
  PARTNER: {
    DASHBOARD: '/partner/dashboard',
    BROWSE: '/partner/browse',
    ORDERS: '/partner/orders',
    PROFILE: '/partner/profile',
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
  },
  PRODUCTS: {
    LIST: '/api/products',
    CREATE: '/api/products',
    DETAIL: '/api/products/[id]',
    UPDATE: '/api/products/[id]',
    DELETE: '/api/products/[id]',
    SEARCH: '/api/products/search',
  },
  ORDERS: {
    LIST: '/api/orders',
    CREATE: '/api/orders',
    DETAIL: '/api/orders/[id]',
    UPDATE: '/api/orders/[id]',
    CANCEL: '/api/orders/[id]/cancel',
  },
  MESSAGES: {
    LIST: '/api/messages',
    CREATE: '/api/messages',
    CHAT: '/api/messages/chat/[id]',
  },
  UPLOAD: {
    IMAGE: '/api/upload/image',
    DOCUMENT: '/api/upload/document',
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported file format.',
  LOGIN_REQUIRED: 'Please log in to continue.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  PRODUCT_CREATED: 'Product listed successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  ORDER_PLACED: 'Order placed successfully',
  ORDER_UPDATED: 'Order updated successfully',
  MESSAGE_SENT: 'Message sent successfully',
  PASSWORD_RESET: 'Password reset email sent',
  REGISTRATION_SUCCESS: 'Account created successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'agri-connect-user-preferences',
  SEARCH_HISTORY: 'agri-connect-search-history',
  CART: 'agri-connect-cart',
  THEME: 'agri-connect-theme',
} as const;

// Theme configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type Theme = typeof THEMES[keyof typeof THEMES];

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_CHAT: process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true',
  ENABLE_PAYMENTS: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true',
  ENABLE_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_REVIEWS: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === 'true',
} as const;

// Social media links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/agriconnect',
  FACEBOOK: 'https://facebook.com/agriconnect',
  INSTAGRAM: 'https://instagram.com/agriconnect',
  LINKEDIN: 'https://linkedin.com/company/agriconnect',
} as const;

// Contact information
export const CONTACT_INFO = {
  EMAIL: 'contact@agri-connect.com',
  PHONE: '+1 (555) 123-4567',
  ADDRESS: '123 Farm Street, Agriculture City, AC 12345',
  SUPPORT_EMAIL: 'support@agri-connect.com',
} as const;

// Regular expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export default {
  APP_NAME,
  APP_DESCRIPTION,
  USER_ROLES,
  PRODUCT_CATEGORIES,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};