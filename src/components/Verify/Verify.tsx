"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Delete, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import VerifyingModal from "../common/VerifyingModal/VerifyingModal";
import { useAppDispatch, useAppSelector } from "@/src/redux/reduxStore";
import { setOTPState } from "@/src/redux/features/otpExpiry/otpExpirySlice";
import { formatTimeSecToMin } from "@/src/lib/helper";
import { toast } from "react-toastify";

const AccountVerification = () => {
  const router = useRouter();
  const { otpExpiry, email: otpEmail } = useAppSelector(
    (state) => state.aotpExpiry,
  );
  const dispatch = useAppDispatch();

  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [modalStage, setModalStage] = useState<"verifying" | "success" | "">(
    "",
  );
  const [isOtpValid, setIsOtpValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const initOtpTimer = () => {
    const expiry = Number(process.env.NEXT_PUBLIC_OTP_EXPIRY);

    const expiryTimestamp = Date.now() + expiry * 60 * 1000;

    dispatch(setOTPState({ otpExpiry: expiryTimestamp }));
  };

  useEffect(() => {
    const initOtpTimer = () => {
      const expirySeconds = Number(process.env.NEXT_PUBLIC_OTP_EXPIRY);

      const expiryTimestamp = Date.now() + expirySeconds * 60 * 1000;

      dispatch(setOTPState({ otpExpiry: expiryTimestamp }));
    };
    if (!otpExpiry) {
      initOtpTimer();
    }
  }, [dispatch, otpExpiry]);

  useEffect(() => {
    if (!otpExpiry) return;

    const tick = () => {
      const remainingSeconds = Math.max(
        0,
        Math.floor((otpExpiry - Date.now()) / 1000),
      );

      setTimeLeft(remainingSeconds);

      if (remainingSeconds === 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setTimeLeft(0);
      }
    };

    tick();

    timerRef.current = setInterval(tick, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [otpExpiry, dispatch]);

  const handleKeyPress = (num: string) => {
    setErrorMessage("");
    if (activeSlot < 6) {
      const newOtp = [...otp];
      newOtp[activeSlot] = num;
      setOtp(newOtp);
      setActiveSlot((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBackspace = () => {
    setErrorMessage("");
    const newOtp = [...otp];
    if (otp[activeSlot] !== "") {
      newOtp[activeSlot] = "";
    } else {
      const prevSlot = Math.max(activeSlot - 1, 0);
      newOtp[prevSlot] = "";
      setActiveSlot(prevSlot);
    }
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 6 && otpEmail) {
      setModalStage("verifying");

      try {
        const res = await fetch("/api/v1/auth/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: otpEmail,
            otp: fullOtp,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 409) {
            setIsOtpValid(true);
            return;
          }
          setErrorMessage(data.message);
          return;
        }

        setIsOtpValid(true);
      } catch (error) {
        console.warn("verify error: ", error);
      }
    }
  };

  const handleOnComplete = () => {
    if (isOtpValid) {
      setModalStage("success");
      toast.success("Account verified");
      router.push("/signin");
      return;
    }
    setModalStage("");
    toast.error(errorMessage);
    setErrorMessage(errorMessage);
  };

  const handleResendOTP = async () => {
    try {
      const res = await fetch("/api/v1/auth/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        setErrorMessage(data.message);
        return;
      }
      initOtpTimer();
      setOtp(["", "", "", "", "", ""]);
      setActiveSlot(0);
      setErrorMessage("");
    } catch (error) {
      console.warn("error resending otp: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-8 font-sans">
      {/* Navigation */}
      <div className="w-full max-w-2xl flex justify-start mb-16">
        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-900">
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 text-center">
          Enter Your 6 digit code
        </h1>
        <p className="text-slate-400 text-sm md:text-base text-center mb-12 max-w-70">
          Please check your email and enter your 6 digit code
        </p>

        {/* OTP Input Display */}
        <div className="flex gap-3 mb-6">
          {otp.map((digit, index) => (
            <div
              key={index}
              onClick={() => setActiveSlot(index)}
              className={`w-12 sm:w-14 md:w-16 h-14 flex items-center justify-center rounded-xl text-xl font-bold transition-all border-2 cursor-pointer
                ${
                  index === activeSlot
                    ? "border-blue-600 bg-slate-100 text-slate-900 shadow-sm"
                    : "border-transparent bg-slate-400 text-white"
                }`}
            >
              {digit}
            </div>
          ))}
        </div>

        {/* Resend Link */}
        <p className="text-sm font-medium mb-12">
          Didn&apos;t get the code?{" "}
          <button
            className={`font-bold ${
              timeLeft > 0
                ? "text-slate-400 cursor-not-allowed"
                : "text-blue-600 hover:underline"
            }`}
            onClick={() => handleResendOTP()}
            disabled={timeLeft > 0}
          >
            {`Resend ${timeLeft > 0 ? formatTimeSecToMin(timeLeft) : ""}`}
          </button>
        </p>
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

        {/* Verify Button */}
        <button
          className={`w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all mb-12 shadow-lg shadow-blue-100 uppercase ${otp.join("").length < 6 ? "cursor-not-allowed" : ""}`}
          onClick={() => handleVerify()}
          disabled={otp.join("").length < 6}
        >
          Verify
        </button>

        {/* Custom Numeric Keypad */}
        <div className="w-full max-w-sm bg-slate-100/80 p-6 rounded-[2.5rem]">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                className="h-14 bg-slate-400 text-white rounded-lg flex flex-col items-center justify-center hover:bg-slate-500 active:bg-slate-600 transition-colors shadow-sm"
              >
                <span className="text-xl font-bold">{num}</span>
                <span className="text-[10px] opacity-70 uppercase tracking-tighter">
                  {num === 2 && "abc"}
                  {num === 3 && "def"}
                  {num === 4 && "ghi"}
                  {num === 5 && "jkl"}
                  {num === 6 && "mno"}
                  {num === 7 && "pqrs"}
                  {num === 8 && "tuv"}
                  {num === 9 && "wxyz"}
                </span>
              </button>
            ))}
            <div /> {/* Spacer */}
            <button
              onClick={() => handleKeyPress("0")}
              className="h-14 bg-slate-400 text-white rounded-lg text-xl font-bold flex items-center justify-center hover:bg-slate-500 active:bg-slate-600 shadow-sm"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="h-14 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center hover:bg-emerald-200 active:bg-emerald-300 shadow-sm"
            >
              <Delete size={24} />
            </button>
          </div>

          {/* Bottom Indicator */}
          <div className="w-24 h-1 bg-slate-900/10 rounded-full mx-auto mt-6" />
        </div>
      </div>

      {modalStage === "verifying" && (
        <VerifyingModal
          onComplete={handleOnComplete}
          message="Verifying OTP..."
          initialProgress={20}
        />
      )}
      {modalStage === "success" && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center">
            <p className="mb-10">Account Verification complete</p>
            <CheckCircle className="text-green-600 w-full h-full" />
            <p className="mt-20">
              Redirecting to sign in{" "}
              <span className="inline-block animate-ellipsis ml-1">.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountVerification;
