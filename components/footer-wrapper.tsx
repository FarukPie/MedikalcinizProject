"use client";

import { usePathname } from "next/navigation";

export function FooterWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    return <>{children}</>;
}
