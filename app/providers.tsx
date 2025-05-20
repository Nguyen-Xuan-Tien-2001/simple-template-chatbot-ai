// app/providers.tsx
"use client";

import { ThemeProvider } from "@/src/provider/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: Luôn tạo một QueryClient mới cho mỗi request
    return makeQueryClient();
  } else {
    // Browser: Tạo hoặc lấy QueryClient duy nhất
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
