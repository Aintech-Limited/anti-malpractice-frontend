"use client";

import { AlertTriangle, ArrowRight, Building2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/providers/auth/AuthContext";
import { ProtectedRouteEnum, UserRoleTypeEnum } from "@/src/lib/enums";

const DepartmentSelectionPrompt = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAuth();

  if (
    user?.departmentId ||
    pathname.endsWith("/profile") ||
    user?.role !== UserRoleTypeEnum.STUDENT
  ) {
    return null;
  }

  const handleGoToProfile = () => {
    router.push(ProtectedRouteEnum.STUDENTS + "/profile");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2rem)] max-w-sm">
      <div className="relative overflow-hidden rounded-2xl border border-red-300 bg-white shadow-2xl shadow-red-950/20">
        <div className="h-1.5 bg-red-600" />

        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 border border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-red-700">
                  Action Required
                </h3>

                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  Required
                </span>
              </div>

              <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-slate-700">
                Your department has not been selected yet.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
            <div className="flex gap-2.5">
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

              <p className="text-xs leading-relaxed text-red-800">
                Please go to your profile and select your department to continue
                using the dashboard.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoToProfile}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            Select Department
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 border-t border-red-100 bg-red-50/70 px-3 py-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />

          <span className="text-[10px] font-semibold text-red-600">
            Department selection is required
          </span>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSelectionPrompt;
