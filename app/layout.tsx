import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Medikalciniz",
  description: "Medical E-commerce",
};

import { Footer } from "@/components/footer";
import { FooterWrapper } from "@/components/footer-wrapper";

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased bg-slate-50`}
      >
        <Providers>
          {children}
          <FooterWrapper>
            <Footer />
          </FooterWrapper>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
