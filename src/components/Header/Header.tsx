"use client";

import Link from "next/link";
import { useAuth } from "@/src/providers/auth/AuthContext";
import { useEffect, useLayoutEffect, useState } from "react";
import { Menu, X, Globe, ChevronDown, Shield, ChevronUp } from "lucide-react";
import Image from "next/image";
import { aintechLogo } from "@/public/assetLinks";
import MobileSubItem from "./MobileSubItem/MobileSubItem";
import DropdownItem from "./DropdownItem/DropdownItem";
import { usePathname } from "next/navigation";
import { UnProtectedRouteEnum } from "@/src/lib/enums";
import { APP_NAME } from "@/src/lib/data";

const Header = () => {
  const pathname = usePathname();

  const { user, loading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Mobile accordion states
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  const MOBILE_BREAKPOINT = 900;

  useEffect(() => {
    if (!user) return;

    signOut();
  }, [signOut, user]);
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className=" fixed w-full border-b border-gray-100 bg-white top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 flex items-center justify-between h-20">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src={aintechLogo} alt="FINDU LOGO" width={60} height={40} />
            <span className="font-bold text-slate-900 tracking-tight text-l">
              {APP_NAME}
            </span>
          </div>
        </Link>

        {windowWidth && windowWidth > 700 && (
          <nav className="hidden md:flex items-center gap-3 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>

            {/* <div className="relative">
              <button
                onClick={(e) => toggleDropdown(e, "products")}
                className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${
                  activeDropdown === "products" ? "text-blue-600" : ""
                }`}
              >
                Products{" "}
                <ChevronDown
                  size={14}
                  className={
                    activeDropdown === "products"
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />
              </button>
              {activeDropdown === "products" && (
                <div className="absolute top-10 left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-xl p-2 animate-in fade-in zoom-in duration-150">
                  <DropdownItem
                    icon={<Box size={16} />}
                    label="AI Models"
                    desc="LLM Infrastructure"
                    href="/products/ai"
                  />
                  <DropdownItem
                    icon={<Layout size={16} />}
                    label="Dashboard"
                    desc="Analytics Tools"
                    href="/products/dashboard"
                  />
                </div>
              )}
            </div> */}

            <div className="relative">
              <button
                onClick={(e) => toggleDropdown(e, "resources")}
                className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${
                  activeDropdown === "resources" ? "text-blue-600" : ""
                }`}
              >
                Resources{" "}
                <ChevronDown
                  size={14}
                  className={
                    activeDropdown === "resources"
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />
              </button>
              {activeDropdown === "resources" && (
                <div className="absolute top-10 left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-xl p-2 animate-in fade-in zoom-in duration-150">
                  {/* <DropdownItem
										icon={<BookOpen size={16} />}
										label="Documentation"
										href="/docs"
									/>
									<DropdownItem
										icon={<HelpCircle size={16} />}
										label="Help Center"
										href="/support"
									/> */}
                  <DropdownItem
                    icon={<Shield size={16} />}
                    label="Privacy"
                    href="/privacy"
                  />
                  <DropdownItem
                    icon={<Shield size={16} />}
                    label="Terms"
                    href="/terms"
                  />
                </div>
              )}
            </div>

            {/* <Link
							href="/pricing"
							className="hover:text-blue-600 transition-colors"
						>
							Pricing
						</Link> */}
          </nav>
        )}

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
              <Globe size={18} />
              <span className="font-semibold text-sm text-slate-900">EN</span>
            </div>

            <div className="relative">
              {loading ? (
                <div className="h-8 w-8 bg-gray-100 animate-pulse rounded-full"></div>
              ) : user ? (
                <button
                  onClick={(e) => toggleDropdown(e, "profile")}
                  className="flex items-center gap-2 group p-1 pr-3 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-bold text-xs">
                    {user?.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {user?.email}
                  </span>
                </button>
              ) : pathname === UnProtectedRouteEnum.SIGNIN ? null : (
                <Link
                  href={UnProtectedRouteEnum.SIGNIN}
                  className="font-bold text-sm text-slate-900 hover:text-blue-600"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen &&
        windowWidth !== null &&
        windowWidth <= MOBILE_BREAKPOINT && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-30 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="fixed top-0 left-0 h-full w-64 max-w-full bg-white z-40 shadow-lg overflow-y-auto animate-in slide-in-from-left duration-300 md:hidden">
              <div className="flex flex-col p-4 gap-2 h-full">
                <div className="mb-4 pb-4 border-b border-gray-100">
                  {pathname === UnProtectedRouteEnum.SIGNIN ? (
                    <Link
                      href={UnProtectedRouteEnum.SIGNUP}
                      className="text-xl font-bold text-slate-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  ) : (
                    <Link
                      href={UnProtectedRouteEnum.SIGNIN}
                      className="text-xl font-bold text-slate-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  )}
                </div>

                <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
                  <Link
                    href="/"
                    className="py-2 text-base font-semibold text-slate-900 border-b border-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>

                  {/* <div className="flex flex-col border-b border-gray-50">
										<button
											onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
											className="flex items-center justify-between py-2 text-base font-semibold text-slate-900"
										>
											Products{' '}
											{mobileProductsOpen ? (
												<ChevronUp size={18} />
											) : (
												<ChevronDown size={18} />
											)}
										</button>
										{mobileProductsOpen && (
											<div className="pl-3 pb-3 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
												<MobileSubItem
													icon={<Box size={16} />}
													label="AI Models"
													href="/products/ai"
												/>
												<MobileSubItem
													icon={<Layout size={16} />}
													label="Dashboard"
													href="/products/dashboard"
												/>
											</div>
										)}
									</div> */}

                  <div className="flex flex-col border-b border-gray-50">
                    <button
                      onClick={() =>
                        setMobileResourcesOpen(!mobileResourcesOpen)
                      }
                      className="flex items-center justify-between py-2 text-base font-semibold text-slate-900"
                    >
                      Resources{" "}
                      {mobileResourcesOpen ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                    {mobileResourcesOpen && (
                      <div className="pl-3 pb-3 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                        {/* <MobileSubItem
													icon={<BookOpen size={16} />}
													label="Documentation"
													href="/docs"
												/>
												<MobileSubItem
													icon={<HelpCircle size={16} />}
													label="Help Center"
													href="/support"
												/> */}
                        <MobileSubItem
                          icon={<Shield size={16} />}
                          label="Privacy"
                          href="/privacy"
                        />
                        <MobileSubItem
                          icon={<Shield size={16} />}
                          label="Terms"
                          href="/terms"
                        />
                      </div>
                    )}
                  </div>

                  {/* <Link
										href="/pricing"
										className="py-2 text-base font-semibold text-slate-900"
										onClick={() => setIsMenuOpen(false)}
									>
										Pricing
									</Link> */}
                </nav>

                <div className="mt-auto pt-6 flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <Globe size={18} />
                  <span>Language: English (US)</span>
                </div>
              </div>
            </div>
          </>
        )}
    </header>
  );
};

export default Header;
