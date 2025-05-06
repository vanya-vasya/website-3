import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { ModalProvider } from "@/components/modal-provider";
import { ToasterProvider } from "@/components/toaster-provider";
import { Nunito  } from "next/font/google";

import NextTopLoader from "nextjs-toploader";

import { GoogleAnalytics } from "@next/third-parties/google";

const nunito = Nunito({ subsets: ["latin"], weight: ['400'], display: 'swap',});

export const metadata: Metadata = {
  title: "Neuvisia - new vision of AI",
  description:
    "Experience Neuvisia – the smart engine of AI innovation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${nunito.className} antialiased`}>
          <GoogleAnalytics gaId="G-X6MQWY83RC" />
          <ModalProvider />
          <ToasterProvider />
          <NextTopLoader color="#3c3c77" showSpinner={false} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
