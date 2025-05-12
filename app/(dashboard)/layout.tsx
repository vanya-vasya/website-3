import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import {
  getApiUsedGenerations,
  getApiAvailableGenerations,
} from "@/lib/api-limit";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiUsedGenerations = await getApiUsedGenerations();
  const apiAvailableGenerations = await getApiAvailableGenerations();

  return (
    <div className="h-full relative bg-slate-900">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-slate-900">
        <Sidebar
          apiUsedGenerations={apiUsedGenerations}
          apiAvailableGenerations={apiAvailableGenerations}
        />
      </div>
      <main className="md:pl-72 pb-10 bg-slate-900">
        <div className="max-w-5xl m-auto md:py-10 px-4 lg:px-8 ">
          <Navbar />
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
