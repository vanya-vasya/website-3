import {
  getApiUsedGenerations,
  getApiAvailableGenerations,
} from "@/lib/api-limit";
import { AnimatedLayout, AnimatedPage } from "@/components/animated-layout";
import Link from "next/link";
import Image from "next/image";
import DashboardHeader from "@/components/dashboard-header";
import { CreditProvider } from "@/lib/contexts/credit-context";
import { CookieSettingsButton } from "@/components/cookie-settings-button";
import { COMPANY_ADDRESS, COMPANY_EMAIL } from "@/lib/company";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiUsedGenerations = await getApiUsedGenerations();
  const apiAvailableGenerations = await getApiAvailableGenerations();

  return (
    <CreditProvider
      initialUsedGenerations={apiUsedGenerations}
      initialAvailableGenerations={apiAvailableGenerations}
    >
      <div className="h-auto relative min-h-screen bg-white">

        <AnimatedLayout>
          <DashboardHeader 
            initialUsedGenerations={apiUsedGenerations}
            initialAvailableGenerations={apiAvailableGenerations}
          />
        </AnimatedLayout>

        <main className="flex-1 py-12 lg:pt-16 relative z-10">
          <div className="container py-8 md:py-10">
            <AnimatedPage>{children}</AnimatedPage>
          </div>
        </main>

      <footer className="py-6 border-t border-gray-200 bg-white">
        <div className="container">
          <div className="px-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: 1.2,
                letterSpacing: '0.01em',
                textTransform: 'none',
                color: '#0f172a'
              }}
            >
            QUICK FIT LTD (№15995367) <br /> Email: {COMPANY_EMAIL}{" "}
              <br />
              {COMPANY_ADDRESS} <br />
              Copyright © {new Date().getFullYear()}. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <Link 
                href="/privacy-policy" 
                className="hover:text-indigo-600"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#0f172a'
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="hover:text-indigo-600"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#0f172a'
                }}
              >
                Terms and Conditions
              </Link>
              <Link 
                href="/return-policy" 
                className="hover:text-indigo-600"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#0f172a'
                }}
              >
                Refund and Cancellation Policy
              </Link>
              <Link 
                href="/cookies-policy" 
                className="hover:text-indigo-600"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#0f172a'
                }}
              >
                Cookies Policy
              </Link>
              <Link
                href="/payment-policy"
                className="hover:text-indigo-600"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#0f172a'
                }}
              >
                Payment Policy
              </Link>
              <CookieSettingsButton />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Image src="/cards_logo.png" alt="cards" width={300} height={24} />
          </div>
        </div>
      </footer>
    </div>
    </CreditProvider>
  );
}
