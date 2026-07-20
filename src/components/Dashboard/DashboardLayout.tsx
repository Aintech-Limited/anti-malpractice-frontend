"use client";

import { useState, useLayoutEffect } from "react";
import { Menu } from "lucide-react";
import { DashboardLayoutProps } from "./interface";
import DashboardNavBar from "./DashboardNavBar/DashboardNavBar";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const examPattern =
    /^\/dashboard\/students\/exams\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  const isExamPage = examPattern.test(pathname);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 || isExamPage) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExamPage]);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased flex flex-col font-sans">
      <DashboardNavBar isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 relative">
        <button
          onClick={toggleSidebar}
          className={`fixed left-6 top-6 z-60 h-12 w-12 bg-white rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 lg:flex ${isSidebarOpen ? "lg:opacity-0 lg:pointer-events-none" : "opacity-100"}`}
        >
          <Menu className="w-7 h-7 text-blue-700" />
        </button>

        <DashboardSidebar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isMobileOpen={isMobileOpen}
        />

        {/*  Backdrop for mobile sidebar open  */}
        {isMobileOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 z-90 bg-black/40 lg:hidden"
          />
        )}

        <main
          className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:pl-64" : "pl-0"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
