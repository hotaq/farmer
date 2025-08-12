import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth utilities
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  },

  // Update password
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    return { data, error };
  },

  // Update user metadata
  updateUser: async (metadata: Record<string, unknown>) => {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    });
    return { data, error };
  },
};

// Database utilities
export const db = {
  // Generic select with filters
  select: (table: string) => {
    return supabase.from(table).select();
  },

  // Generic insert
  insert: <T>(table: string, data: T | T[]) => {
    return supabase.from(table).insert(data);
  },

  // Generic update
  update: <T>(table: string, data: Partial<T>) => {
    return supabase.from(table).update(data);
  },

  // Generic delete
  delete: (table: string) => {
    return supabase.from(table).delete();
  },

  // Generic upsert
  upsert: <T>(table: string, data: T | T[]) => {
    return supabase.from(table).upsert(data);
  },
};

// Storage utilities
export const storage = {
  // Upload file
  upload: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
    return { data, error };
  },

  // Update file (upsert)
  updateFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });
    return { data, error };
  },

  // Download file
  download: async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
    return { data, error };
  },

  // Get public URL
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // Delete file
  deleteFile: async (bucket: string, paths: string[]) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(paths);
    return { data, error };
  },

  // List files
  listFiles: async (bucket: string, folder?: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);
    return { data, error };
  },
};

// Real-time utilities
export const realtime = {
  // Subscribe to table changes
  subscribeToTable: (table: string, callback: (payload: unknown) => void) => {
    return supabase
      .channel(`public:${table}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe();
  },

  // Subscribe to specific row changes
  subscribeToRow: (table: string, id: string, callback: (payload: unknown) => void) => {
    return supabase
      .channel(`public:${table}:id=eq.${id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table, filter: `id=eq.${id}` },
        callback
      )
      .subscribe();
  },

  // Subscribe to user's data
  subscribeToUserData: (userId: string, table: string, callback: (payload: unknown) => void) => {
    return supabase
      .channel(`public:${table}:user_id=eq.${userId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table, filter: `user_id=eq.${userId}` },
        callback
      )
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe: (channel: ReturnType<typeof supabase.channel>) => {
    return supabase.removeChannel(channel);
  },
};

// Error handling utilities
export const handleSupabaseError = (error: unknown): string => {
  if (!error) return '';
  
  const errorObj = error as { message?: string; status?: number };
  
  // Common Supabase error messages
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Please check your email and click the confirmation link',
    'User already registered': 'An account with this email already exists',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long',
    'Unable to validate email address: invalid format': 'Please enter a valid email address',
    'Database error saving new user': 'Unable to create account. Please try again.',
    'row-level security': 'You do not have permission to perform this action',
  };

  // Check for specific error messages
  for (const [key, message] of Object.entries(errorMessages)) {
    if (errorObj.message?.includes(key)) {
      return message;
    }
  }

  // Return the original error message if no match found
  return errorObj.message || 'An unexpected error occurred';
};

// Type guards
export const isAuthError = (error: unknown): boolean => {
  const errorObj = error as { message?: string; status?: number };
  return !!(errorObj?.message?.includes('auth') || errorObj?.status === 401);
};

export const isNetworkError = (error: unknown): boolean => {
  const errorObj = error as { message?: string };
  return !!(errorObj?.message?.includes('network') || errorObj?.message?.includes('fetch'));
};

// Helper to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const { user } = await auth.getCurrentUser();
  return !!user;
};

// Helper to get user role from metadata
export const getUserRole = async (): Promise<string | null> => {
  const { user } = await auth.getCurrentUser();
  return user?.user_metadata?.role || null;
};

export default supabase;