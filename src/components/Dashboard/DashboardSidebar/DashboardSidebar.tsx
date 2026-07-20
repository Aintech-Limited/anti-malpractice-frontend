"use client";

import { CircleXIcon, LogOut } from "lucide-react";
import Image from "next/image";
import SidebarItem from "./SidebarItem/SidebarItem";
import { LecturerNavGroups, StudentNavGroups, AdminNavGroups } from "../data";
import { APP_NAME } from "@/src/lib/data";
import { aintechLogo } from "@/public/assetLinks";
import { useAuth } from "@/src/providers/auth/AuthContext";
import { IDashboardSidebarProps } from "./interface";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/redux/reduxStore";
import { useEffect, useState } from "react";
import { signOut as GoogleSinOut } from "next-auth/react";

import {
  ProfileTypeEnum,
  ProtectedRouteEnum,
  ProtectedRouteEnumValue,
  UnProtectedRouteEnum,
  UserRoleTypeEnum,
} from "@/src/lib/enums";
import {
  clearFaceAuthState,
  setFaceAuthState,
} from "@/src/redux/features/faceAuth/faceAuthSlice";
import {
  clearSelfieImageId,
  clearVerification,
} from "@/src/redux/features/lecturerVerificationImages/lecturerVerificationImages";
import FaceIDSetupModal from "../FaceIDSetupModal/FaceIDSetupModal";
import Link from "next/link";
import { toast } from "react-toastify";

const DashboardSidebar = ({
  toggleSidebar,
  isSidebarOpen,
  isMobileOpen,
}: IDashboardSidebarProps) => {
  const { user: userData, loading, signOut, signIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { SkipFaceAuth } = useAppSelector((state) => state.afaceAuth);
  const [showFaceId, setShowFaceId] = useState<boolean>(false);

  useEffect(() => {
    if (
      !Object.values(ProtectedRouteEnum).includes(
        pathname as ProtectedRouteEnumValue,
      )
    )
      return;
    if (
      userData?.profileType === ProfileTypeEnum.LECTURER &&
      userData?.idRecorded === false
    ) {
      router.push(ProtectedRouteEnum.DASHBOARD_VERIFY);
      return;
    }
    if (
      !userData?.faceAuthEnabled &&
      userData?.profileType === ProfileTypeEnum.STUDENT &&
      !SkipFaceAuth
    ) {
      const enableFaceAuth = () => {
        setShowFaceId(true);
      };
      enableFaceAuth();
      return;
    }
  }, [
    SkipFaceAuth,
    pathname,
    router,
    userData?.faceAuthEnabled,
    userData?.idRecorded,
    userData?.profileType,
  ]);

  const handleCloseFaceId = () => {
    setShowFaceId(false);
    dispatch(setFaceAuthState({ SkipFaceAuth: true }));
    return;
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/v1/auth/signout", {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status < 400 || res.status === 401) {
        const data = await res.json();
        console.log(data.message);

        signOut();
        dispatch(clearFaceAuthState());
        dispatch(clearVerification());
        dispatch(clearSelfieImageId());
        GoogleSinOut({
          redirect: true,
          callbackUrl: UnProtectedRouteEnum.SIGNIN,
        });

        console.log("User logged out");
        if (window) {
          window.location.href = UnProtectedRouteEnum.SIGNIN;
        } else {
          router.push(UnProtectedRouteEnum.SIGNIN);
        }

        toast.info("Signing you out...");
        return;
      } else {
        console.log(await res.json());
      }
    } catch (error) {
      console.warn("signout error: ", error);
    }
  };

  const navGroups =
    userData?.role === UserRoleTypeEnum.STAFF
      ? LecturerNavGroups
      : userData?.role === UserRoleTypeEnum.USER
        ? StudentNavGroups
        : AdminNavGroups;

  return (
    <div>
      <FaceIDSetupModal
        isOpen={showFaceId}
        onClose={() => handleCloseFaceId()}
      />
      {/*  Desktop Sidebar  */}
      <aside
        className={`fixed inset-y-0 left-0 z-1000 w-64 bg-blue-600 flex flex-col p-6 transition-transform duration-300 transform select-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:absolute lg:top-0 lg:left-0 lg:block lg:w-64 lg:h-full lg:opacity-0 lg:pointer-events-none"}`}
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-white tracking-tighter">
            <Link href="/dashboard" className="cursor-pointer">
              <Image
                alt={`${APP_NAME} LOGO`}
                src={aintechLogo}
                width={80}
                height={40}
                className="cursor-pointer"
              />
              {APP_NAME}
            </Link>
          </h2>
          <CircleXIcon
            onClick={toggleSidebar}
            className="w-6 h-6 text-blue-100 cursor-pointer hidden lg:block"
          />
        </div>

        <nav className="flex-1 space-y-2">
          {navGroups.map((item) => (
            <SidebarItem key={item.name} item={item} />
          ))}
        </nav>

        <button
          className="flex items-center gap-4 h-12 px-4 w-full text-white text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/15 transition-all mt-auto mb-6 group"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 text-blue-100 transition-colors group-hover:text-white" />
          <span>Log out</span>
        </button>

        <div className="flex items-center gap-4 border-t border-white/20 pt-6">
          <Image
            src={
              userData?.avatarURL ??
              "https://images.unsplash.com/photo-1599566150163-29194dcaad36?&w=64&h=64&auto=format&fit=crop&crop=faces&q=80"
            }
            alt="Student"
            className="w-12 h-12 rounded-xl border border-white/20"
            height={30}
            width={70}
          />
          <div>
            <p className="text-sm font-bold text-white">
              {`${userData?.firstName} ${userData?.lastName}`}
            </p>
            <p className="text-xs text-blue-100">{userData?.email ?? ""}</p>
          </div>
        </div>
      </aside>

      {/*  Mobile Sidebar Overlay  */}
      <aside
        className={`fixed inset-y-0 left-0 z-100 w-64 bg-blue-600 flex flex-col p-6 transition-transform duration-300 transform select-none lg:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-white tracking-tighter">
            <Image
              alt={`${APP_NAME} LOGO`}
              src={aintechLogo}
              width={80}
              height={40}
            />
            {APP_NAME}
          </h2>
          <CircleXIcon
            onClick={toggleSidebar}
            className="w-6 h-6 text-blue-100 cursor-pointer"
          />{" "}
        </div>
        <nav className="flex-1 space-y-2">
          {navGroups.map((group) => (
            <SidebarItem key={group.name} item={group} />
          ))}
        </nav>
        <button
          className="flex items-center gap-4 h-12 px-4 w-full text-white text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/15 transition-all mt-auto mb-6 group"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 text-blue-100 transition-colors group-hover:text-white" />
          <span>Log out</span>
        </button>

        <div className="flex items-center gap-4 border-t border-white/20 pt-6">
          {userData?.avatarURL ? (
            <Image
              src={
                userData?.avatarURL ??
                "https://images.unsplash.com/photo-1599566150163-29194dcaad36?&w=64&h=64&auto=format&fit=crop&crop=faces&q=80"
              }
              alt="Student"
              className="w-12 h-12 rounded-xl border border-white/20"
              height={30}
              width={70}
            />
          ) : (
            <div className="w-12 h-12 rounded-xl border border-white/20">{`${userData?.firstName?.slice(0, 1) ?? ""} ${userData?.lastName?.slice(0, 1) ?? ""}`}</div>
          )}

          <div>
            <p className="text-sm font-bold text-white">{`${userData?.firstName} ${userData?.lastName}`}</p>
            <p className="text-xs text-blue-100">{userData?.email ?? ""}</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DashboardSidebar;
