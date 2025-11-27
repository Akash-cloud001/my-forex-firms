"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const client = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
}
