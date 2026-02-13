"use client";

import React, { ReactNode, useEffect } from 'react';
import { I18nProvider } from "../i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/query-client";
import { initializePersistence } from "../lib/react-query-persist";
import { ThemeProvider } from "../components/layout/ThemeProvider";
import { ToastProvider } from "../components/ui/toast";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    initializePersistence();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
