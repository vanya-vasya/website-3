import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { UserButton } from "@clerk/nextjs";
import { getApiUsedGenerations, getApiAvailableGenerations } from "@/lib/api-limit";
import { UsageProgress } from "@/components/usage-progress";
import { AnimatedLayout, AnimatedPage } from "@/components/animated-layout";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiUsedGenerations = await getApiUsedGenerations();
  const apiAvailableGenerations = await getApiAvailableGenerations();

  return (
    <div className="h-full relative dark">
      <AnimatedLayout>
        <div className="container flex h-16 items-center">
          <MobileNav initialUsedGenerations={apiUsedGenerations} initialAvailableGenerations={apiAvailableGenerations} />
          <div className="hidden md:block flex-1">
          <MainNav initialUsedGenerations={apiUsedGenerations} initialAvailableGenerations={apiAvailableGenerations}  />
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:block w-[200px]">
              <UsageProgress 
                initialUsedGenerations={apiUsedGenerations}
                initialAvailableGenerations={apiAvailableGenerations}
              />
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </AnimatedLayout>
      <main className="flex-1 py-12 lg:pt-16">
        <div className="container py-6 md:py-8">
          <AnimatedPage>
            {children}
          </AnimatedPage>
        </div>
      </main>
    </div>
  );
}
