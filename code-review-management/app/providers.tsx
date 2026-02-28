"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: process.env.NODE_ENV === "production" ? 3 : 0,
    },
  },
});

/**
 * Providers to wrap around the application's root layout. Includes TanStack
 * Query client provider.
 *
 * Docs:
 * 1. https://tanstack.com/query/latest/docs/framework/react/examples/simple?panel=code
 *
 * @param children: The children of the root layout.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
