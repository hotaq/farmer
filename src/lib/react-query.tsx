'use client';

import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error: unknown) => {
          // Don't retry on 4xx errors
          const errorWithStatus = error as { status?: number };
          if (errorWithStatus?.status && errorWithStatus.status >= 400 && errorWithStatus.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools 
        initialIsOpen={false} 
        buttonPosition="bottom-right"
      />
    </QueryClientProvider>
  );
}

// Custom hooks for common query patterns
export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query key factory for consistent key management
export const queryKeys = {
  all: ['agri-connect'] as const,
  users: () => [...queryKeys.all, 'users'] as const,
  user: (id: string) => [...queryKeys.users(), id] as const,
  products: () => [...queryKeys.all, 'products'] as const,
  product: (id: string) => [...queryKeys.products(), id] as const,
  productsByUser: (userId: string) => [...queryKeys.products(), 'user', userId] as const,
  chats: () => [...queryKeys.all, 'chats'] as const,
  chat: (id: string) => [...queryKeys.chats(), id] as const,
  messages: (chatId: string) => [...queryKeys.chat(chatId), 'messages'] as const,
  orders: () => [...queryKeys.all, 'orders'] as const,
  order: (id: string) => [...queryKeys.orders(), id] as const,
  ordersByUser: (userId: string) => [...queryKeys.orders(), 'user', userId] as const,
};

// Utility function to invalidate related queries
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return {
    invalidateUser: (userId?: string) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.user(userId) });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.users() });
      }
    },
    invalidateProducts: (userId?: string) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.productsByUser(userId) });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.products() });
      }
    },
    invalidateChats: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats() });
    },
    invalidateOrders: (userId?: string) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.ordersByUser(userId) });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders() });
      }
    },
  };
}