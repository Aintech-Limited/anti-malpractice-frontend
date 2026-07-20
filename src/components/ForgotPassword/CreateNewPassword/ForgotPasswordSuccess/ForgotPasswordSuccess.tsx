"use client";

import { Check } from "lucide-react";

const ForgotPasswordSuccess = () => {
  return (
    <div className="fixed inset-0 z-20 min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 font-sans">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        {/* Success Icon Container */}
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-blue-100 animate-in zoom-in duration-300">
          <Check size={48} className="text-white stroke-[3px]" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Forgot Password Success
        </h1>

        <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-16 max-w-70 md:max-w-xs">
          Congratulations Your password is reset. You can use your new password
          with your account
        </p>

        {/* Login Button */}
        <div className="w-full">
          <button
            onClick={() => (window.location.href = "/signin")}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 uppercase tracking-wide text-sm"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSuccess;
