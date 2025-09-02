"use client";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { GuestMobileSidebar } from "@/components/guest-mobile-sidebar";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const routes = [
  {
    name: "Our Story",
    href: "/story",
  },
  {
    name: "Pricing",
    href: "/#pricing",
  },
];

const productItems = [
  {
    name: "Master Chef",
    href: "/dashboard",
  },
  {
    name: "Master Nutritionist",
    href: "/dashboard",
  },
  {
    name: "Cal Tracker",
    href: "/dashboard",
  },
  {
    name: "Digest",
    href: "",
    comingSoon: true,
  },
];

const Header = () => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const handleProductClick = () => {
    setIsProductDropdownOpen(!isProductDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsProductDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsProductDropdownOpen(false);
      }
    };

    if (isProductDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProductDropdownOpen]);

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-6 gap-1">
        <div className="flex">
          <Link href="/" className="-m-1.5 p-1.5">
            <Image width={"98"} height={"39"} src="/logos/TechFlow-Logo.png" alt="TechFlow Logo"/>
          </Link>
        </div>
        <div className="flex gap-x-12 ml-12">
          <div className="nav-container-light-green">
            <div className="dropdown-container">
              <button
                onClick={handleProductClick}
                className="nav-link dropdown-trigger"
              >
                Products
              </button>
              {isProductDropdownOpen && (
                <div className="dropdown-menu">
                  {productItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="dropdown-item"
                      onClick={handleDropdownClose}
                    >
                      {item.name}
                      {item.comingSoon && <span className="coming-soon">Coming Soon</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="nav-container-green">
                      <Link
                        href="/dashboard"
                        className="nav-link"
                      >
                        Dashboard
                      </Link>
                    </div>
                  </motion.div>
                </SignedIn>
                <SignedOut>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="nav-container-green">
                      <Link
                        href="/dashboard"
                        className="nav-link"
                      >
                        Begin
                      </Link>
                    </div>
                  </motion.div>
                </SignedOut>
              </li>
            </ul>
          </div>
          <GuestMobileSidebar />
        </div>
      </nav>

      <style jsx global>{`
        :root {
          --nav-font: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          --contact-font: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .nav-container {
          display: flex;
          background-color: #f8fafc;
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .nav-container-green {
          display: flex;
          background-color: #86efac;
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .nav-container-light-green {
          display: flex;
          background-color: #dcfce7;
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

        .main-header__login-sing-up .nav-link {
          font-family: var(--contact-font) !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          line-height: 1.1 !important;
          letter-spacing: 0.01em !important;
          text-transform: none !important;
          color: #0f172a !important;
          padding: 8px 16px !important;
          border-radius: 9999px !important;
          border: none !important;
        }

        .nav-link:hover {
          background: linear-gradient(to right, #10b981, #059669, #047857);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-decoration: none;
        }

        .dropdown-container {
          position: relative;
        }

        .dropdown-trigger {
          cursor: pointer;
          background: none;
          border: none;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 8px;
          min-width: 200px;
          z-index: 50;
          margin-top: 4px;
          border: 1px solid #e5e7eb;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          font-family: var(--contact-font);
          font-weight: 600;
          font-size: 14px;
          color: #0f172a;
          text-decoration: none;
          border-radius: 8px;
          transition: all 300ms ease-in-out;
          width: 100%;
        }

        .dropdown-item:hover {
          background-color: #f8fafc;
          color: #10b981;
        }

        .coming-soon {
          font-size: 11px;
          background: #f3f4f6;
          color: #6b7280;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
        }
      `}</style>
    </header>
  );
};

export default Header;
