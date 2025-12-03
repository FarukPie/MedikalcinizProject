"use client";

import { usePathname } from "next/navigation";

import { ReactNode } from "react";

export function FooterWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    if (pathname === "/login" || pathname === "/register" || pathname?.startsWith("/admin")) {
        return null;
    }

    return <>{children}</>;
}
