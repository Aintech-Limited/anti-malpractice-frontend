"use client";

import { useLockBodyScroll } from "@/src/lib/hooks/useStopDialogBGPageScrolling";
import { useAppSelector } from "@/src/redux/reduxStore";

interface LoadingOverlayProps {
  message: string;
  isOpen: boolean;
}

const LoadingOverlay = ({ message, isOpen }: LoadingOverlayProps) => {
  useLockBodyScroll({ isOpen });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-50">
      <span className="text-5xl font-bold text-slate-500 animate-pulse">
        {message}...
      </span>
    </div>
  );
};

export const LoadingUserOverlay = ({ message }: LoadingOverlayProps) => {
  const { userRolesLoading } = useAppSelector((state) => state.auth);
  useLockBodyScroll({ isOpen: userRolesLoading });

  if (!userRolesLoading) return null;
  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-50">
      <span className="text-5xl font-bold text-slate-500 animate-pulse">
        {message}...
      </span>
    </div>
  );
};

export default LoadingOverlay;
