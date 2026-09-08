"use client";

import { useAppSelector } from "@/src/redux/reduxStore";
import { Loader2 } from "lucide-react";

const GlobalLoadingIndicator = () => {
  const { visible, text } = useAppSelector((state) => state.globalLoading);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-9999 pointer-events-none animate-bounce">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-900 px-4 py-3 shadow-lg shadow-slate-900/10">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-100">
            {text || "Working..."}
          </span>

          <span className="text-[10px] text-slate-200">Please wait</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingIndicator;
