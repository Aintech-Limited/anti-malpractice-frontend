"use client";

import { aintechLogo } from "@/public/assetLinks";
import { APP_NAME } from "@/src/lib/data";
import { Search } from "lucide-react";
import Image from "next/image";
import { IDashboardNavBarProps } from "./interface";
import NotificationBell from "../Notifications/NotificationBell/NotificationBell";

const DashboardNavBar = ({ isSidebarOpen }: IDashboardNavBarProps) => {
  return (
    <header
      className={`sticky top-0 bg-linear-to-br z-20 pb-4 h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 gap-2 transition-all duration-300 select-none ${isSidebarOpen ? "lg:pl-64" : "pl-6"}`}
    >
      <div className="flex items-center gap-2 ml-14">
        {!isSidebarOpen && (
          <>
            <Image
              alt={`${APP_NAME} LOGO`}
              src={aintechLogo}
              width={50}
              height={20}
            />
            <h2 className="text-l font-extrabold tracking-tighter ">
              {APP_NAME.toUpperCase()}
            </h2>
          </>
        )}
      </div>

      {/* <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
              {['Faculty'].map((item) => (
                <Link
                  key={item}
                  className="hover:text-blue-600 transition-colors"
                  href={`/${item.toLowerCase()}`}
                >
                  {item.replace('-', ' ')}
                </Link>
              ))}
            </nav> */}

      <div className="flex items-center gap-5 flex-1 max-w-md justify-end lg:justify-start">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-600" />
          <input
            type="search"
            placeholder="Search by course code / exam title"
            className="w-full h-11 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all"
          />
        </div>
        <NotificationBell />

        {/* <div className="flex items-center gap-2.5">
                <Image
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?&w=64&h=64&auto=format&fit=crop&crop=faces&q=80"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-gray-100"
                  width={70}
                  height={30}
                />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div> */}
      </div>
    </header>
  );
};

export default DashboardNavBar;
