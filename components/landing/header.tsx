"use client";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { GuestMobileSidebar } from "@/components/guest-mobile-sidebar";
import Image from "next/image";

const routes = [
  {
    name: "Solutions",
    href: "/#solutions",
  },
  {
    name: "Products",
    href: "/#features",
  },
  {
    name: "Why Us",
    href: "/#testimonials",
  },
];

const Header = () => {
  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-6 gap-1">
        <div className="flex">
          <Link href="/" className="-m-1.5 p-1.5">
            <Image width={"150"} height={"60"} src="/logo.png" alt=""/>
          </Link>
        </div>
        <div className="flex gap-x-12 ml-12">
          <div className="nav-container">
            {routes.map((route) => (
              <Link
                key={route.name}
                href={route.href}
                className="nav-link"
              >
                {route.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex lg:flex-1 lg:justify-end">
          <div className="flex ">
            <ul className="main-header__login-sing-up">
              <li>
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#374151] hover:text-[#6366f1]"
                  >
                    Dashboard
                  </Link>
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/dashboard"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#374151] hover:text-[#6366f1]"
                  >
                    Sign In / Sign Up
                  </Link>
                </SignedOut>
              </li>
            </ul>
          </div>
          <GuestMobileSidebar />
        </div>
      </nav>

      <style jsx global>{`
        :root {
          --nav-font: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
                      Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          --contact-font: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
                          Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }

        .nav-container {
          display: flex;
          background-color: #f8fafc;
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .nav-link {
          font-family: var(--contact-font);
          font-weight: 600;
          font-size: 16px;
          line-height: 1.1;
          letter-spacing: 0.01em;
          text-transform: none;
          color: #0f172a;
          padding: 8px 16px;
          border-radius: 9999px;
          transition: all 500ms ease-in-out;
        }

        .nav-link:hover {
          background: linear-gradient(to right, #22d3ee, #3b82f6, #4f46e5);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-decoration: none;
        }
      `}</style>
    </header>
  );
};

export default Header;
