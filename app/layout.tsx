import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

import { ModalProvider } from "@/components/modal-provider";
import { ToasterProvider } from "@/components/toaster-provider";
import { CurrencyProvider } from "@/contexts/currency-context";

import NextTopLoader from "nextjs-toploader";

import { CookieConsentBanner } from "@/components/cookie-consent";
import { GoogleAnalyticsGate } from "@/components/google-analytics-gate";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Yum-mi",
  description: "AI-powered creative tools for everyone",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logos/yum-mi-onigiri-logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/images/icons/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.variable,
            spaceGrotesk.variable
          )}
        >
          <GoogleAnalyticsGate />
          <CookieConsentBanner />
          <CurrencyProvider>
            <ModalProvider />
            <ToasterProvider />
            <NextTopLoader color="#3c3c77" showSpinner={false} />
            {children}
          </CurrencyProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
