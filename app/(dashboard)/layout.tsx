import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { UserButton } from "@clerk/nextjs";
import {
  getApiUsedGenerations,
  getApiAvailableGenerations,
} from "@/lib/api-limit";
import { UsageProgress } from "@/components/usage-progress";
import { AnimatedLayout, AnimatedPage } from "@/components/animated-layout";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiUsedGenerations = await getApiUsedGenerations();
  const apiAvailableGenerations = await getApiAvailableGenerations();

  return (
    <div className="h-auto relative min-h-screen bg-white">

      <AnimatedLayout>
        <div className="container flex h-20 items-center px-4 xl:px-0">
          <MobileNav
            initialUsedGenerations={apiUsedGenerations}
            initialAvailableGenerations={apiAvailableGenerations}
          />
          <div className="hidden xl:block flex-1">
            <MainNav
              initialUsedGenerations={apiUsedGenerations}
              initialAvailableGenerations={apiAvailableGenerations}
            />
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:block w-[220px]">
              <UsageProgress
                initialUsedGenerations={apiUsedGenerations}
                initialAvailableGenerations={apiAvailableGenerations}
              />
            </div>
            <div className="rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-filter backdrop-blur-sm">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </AnimatedLayout>

      <main className="flex-1 py-12 lg:pt-16 relative z-10">
        <div className="container py-8 md:py-10">
          <AnimatedPage>{children}</AnimatedPage>
        </div>
      </main>

      <footer className="py-6 border-t border-gray-200 bg-white">
        <div className="container">
          <div className="px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 space-y-2 md:space-y-0">
            <p>
              GROWTHPIXEL LTD (№16385052) <br /> Email: support@neuvisia.com{" "}
              <br />
              128 City Road, London, United Kingdom, EC1V 2NX, <br />
              Copyright © {new Date().getFullYear()}. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy-policy" className="hover:text-indigo-600">
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="hover:text-indigo-600"
              >
                Terms and Conditions
              </Link>
              <Link href="/return-policy" className="hover:text-indigo-600">
                Return Policy
              </Link>
              <Link href="/cookies-policy" className="hover:text-indigo-600">
                Cookies Policy
              </Link>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <img src="/cards.svg" alt="cards" width={300} height={100} />
          </div>
        </div>
      </footer>
    </div>
  );
}
