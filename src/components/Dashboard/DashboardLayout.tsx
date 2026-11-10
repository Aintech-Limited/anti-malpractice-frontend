"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { Menu } from "lucide-react";
import { DashboardLayoutProps } from "./interface";
import DashboardNavBar from "./DashboardNavBar/DashboardNavBar";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/redux/reduxStore";
import {
  setUserRoles,
  setUserRolesLoading,
  signInAction,
} from "@/src/redux/features/auth/authSlice";
import { LoadingUserOverlay } from "../common/LoadingOverlay/LoadingOverlay";

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { userRoles, user, userRolesLoading } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const examPattern =
    /^\/dashboard\/students\/exams\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  const isExamPage = examPattern.test(pathname);
  useEffect(() => {
    if (userRoles && user) return;
    const getUserWithROles = async () => {
      dispatch(setUserRolesLoading(true));
      try {
        const res = await fetch("/api/v1/users", {
          method: "GET",
          credentials: "include",
        });
        if ([200, 201].includes(res.status)) {
          const data = await res.json();
          const { userRoles, ...restOfUser } = data?.data ?? {};
          if (userRoles) dispatch(setUserRoles(userRoles));
          if (!user && restOfUser) {
            dispatch(signInAction(restOfUser));
          }
          dispatch(setUserRolesLoading(false));
          return;
        }
      } catch (error) {
        console.warn("could not get user data: ", error);
      }
    };

    getUserWithROles();
  }, [userRoles, dispatch, user]);

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
      <LoadingUserOverlay isOpen={userRolesLoading} message="Re-initializing" />
      <DashboardNavBar isSidebarOpen={isSidebarOpen} />

      <div className="relative flex min-w-0 flex-1">
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

        {isMobileOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 z-90 bg-black/40 lg:hidden"
          />
        )}

        <main
          className={`min-w-0 w-full flex-1 transition-all duration-300 ${
            isSidebarOpen ? "lg:pl-64" : "pl-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
