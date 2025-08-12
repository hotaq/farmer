'use client'

import { useState, useEffect } from 'react';
import { auth, AuthState, User } from '@/lib/rule-based-auth';

// Custom hook for rule-based authentication
export function useRuleBasedAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = auth.subscribe((state) => {
      setAuthState(state);
    });

    // Get initial state
    setAuthState(auth.getAuthState());

    return unsubscribe;
  }, []);

  const signUp = async (userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    location: string;
    userType: 'producer' | 'partner';
    bio: string;
  }) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const result = await auth.signUp(userData);
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return result;
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const result = await auth.signIn(email, password);
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return result;
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const result = await auth.signOut();
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return result;
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    signUp,
    signIn,
    signOut
  };
}

// Hook for checking if user has specific role
export function useUserRole() {
  const { user } = useRuleBasedAuth();
  
  return {
    isProducer: user?.userType === 'producer',
    isPartner: user?.userType === 'partner',
    userType: user?.userType || null
  };
}

// Hook for protected routes
export function useRequireAuth(redirectTo?: string) {
  const { isAuthenticated, isLoading } = useRuleBasedAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);
  
  return { isAuthenticated, isLoading };
}