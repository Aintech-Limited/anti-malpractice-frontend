import { ReactNode } from "react";

export const CheckoutContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8">{children}</div>
    </div>
  );
};
