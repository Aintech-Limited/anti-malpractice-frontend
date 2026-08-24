"use client";

import { useState, useEffect } from "react";
import { Mail, X, RefreshCw, Clock } from "lucide-react";
import { IVerifyTokenModalProps } from "./interface";
import TokenInput from "../TokenInput/TokenInput";
import PINInput from "../PINInput/PINInput";

export default function VerifyTokenModal({
  token,
  newPIN,
  loading,
  onTokenChange,
  onPINChange,
  onConfirm,
  onCancel,
  onResendOTP,
}: IVerifyTokenModalProps) {
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage for indicator
  const progress = ((30 * 60 - timeLeft) / (30 * 60)) * 100;

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft(30 * 60);
    setCanResend(false);
    setIsResending(false);
  }, []);

  const handleResendOTP = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      await onResendOTP();
      setTimeLeft(30 * 60);
      setCanResend(false);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 transform transition-all animate-slideUp shadow-2xl">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Verify Token</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Enter the verification token sent to your email
          </p>
        </div>

        <div className="p-6 space-y-6">
          <TokenInput value={token} onChange={onTokenChange} />

          <PINInput
            value={newPIN}
            onChange={onPINChange}
            label="New PIN"
            showToggle={true}
          />

          {/* Countdown Progress */}
          <div className="pt-2">
            {!canResend ? (
              <div className="flex items-center justify-between gap-4 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-10">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                        fill="none"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="#6366f1"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 16}`}
                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress / 100)}`}
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-indigo-600" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-mono font-semibold text-indigo-600 text-lg">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  until resend available
                </div>
              </div>
            ) : (
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 
									bg-linear-to-r from-indigo-500 to-purple-500 
									text-white rounded-lg 
									hover:from-indigo-600 hover:to-purple-600 
									transition-all duration-200
									disabled:opacity-50 disabled:cursor-not-allowed
									font-medium shadow-md"
              >
                {isResending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend Verification Code</span>
                  </>
                )}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">
            Didn&apos;t receive the email? Check your spam folder or contact
            support.
          </p>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
							hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg 
							hover:bg-green-700 transition-colors disabled:opacity-50 
							flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Change PIN"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
