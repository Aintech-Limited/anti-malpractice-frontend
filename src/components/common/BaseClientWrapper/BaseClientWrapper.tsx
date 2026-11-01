import { ReactNode } from "react";

export default function BaseClientWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-8">
      {children}
    </div>
  );
}
