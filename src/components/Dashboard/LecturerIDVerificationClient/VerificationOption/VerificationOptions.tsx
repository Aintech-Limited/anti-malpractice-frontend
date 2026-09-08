"use client";

import {
  ChevronLeft,
  HelpCircle,
  Camera,
  IdCard,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { TVerifyStage } from "../interface";
import { useAppSelector } from "@/src/redux/reduxStore";
import VerificationModal from "./VerificationModal/VerificationModal";
import { toast } from "react-toastify";

const VerificationOption = ({
  setStage,
}: {
  setStage: (stage: TVerifyStage) => void;
}) => {
  const { backId, frontId, selfieId } = useAppSelector(
    (state) => state.alecturerVerificationImages,
  );

  const [option, setOption] = useState<TVerifyStage | null>(null);
  const [showModal, setshowModal] = useState<boolean>(false);
  const [disabled, _] = useState<boolean>(
    backId === "BACK_CAPTURED" &&
      frontId === "FRONT_CAPTURED" &&
      selfieId === "SELFIE_CAPTURED",
  );

  useEffect(() => {
    if (disabled) {
      setshowModal(true);
    }
  }, [disabled]);

  const handleVerifyMyID = () => {
    if (option) {
      setStage(option);
    } else {
      toast.info("Select ID type first!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center py-6 px-4 md:px-8 font-sans">
      {/* Navbar */}
      <div className="w-full max-w-lg flex items-center justify-between mb-8">
        <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <a href="/dashboard">
            <ChevronLeft size={24} className="text-slate-800" />{" "}
          </a>
        </button>
        <h1 className="text-lg font-semibold text-slate-800">
          Verify identity
        </h1>
        <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <HelpCircle size={24} className="text-slate-400" />
        </button>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Government ID Card */}
        <div
          className={`rounded-3xl p-8 shadow-sm flex flex-col items-center text-center border-5 border-transparent hover:border-blue-100 transition-all ${
            option === "GOVERNMENT"
              ? "bg-blue-100 border-4 border-blue-700 transition-all"
              : "bg-white border-4 border-white hover:border-blue-100"
          }`}
          onClick={() => {
            if (!frontId && !backId) setOption("GOVERNMENT");
          }}
        >
          <div className="w-32 h-24 bg-blue-50 rounded-xl flex items-center justify-center mb-6 relative border border-blue-100">
            <IdCard size={48} className="text-blue-400" strokeWidth={1.5} />
            <div className="absolute right-4 space-y-1">
              <div className="h-1 w-8 bg-blue-200 rounded-full" />
              <div className="h-1 w-6 bg-blue-200 rounded-full" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Government ID
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            To use your Government issued ID. <br /> Click here and click on
            `VERIFY MY IDENTITY`
          </p>

          <button
            disabled={true}
            className="flex items-center cursor-not-allowed gap-2 bg-gray-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Camera size={18} fill="currentColor" />
            <div className={`${frontId && backId && "text-red-700"}`}>
              Take photo
            </div>
          </button>
          {frontId && backId && (
            <CheckCircle2 className="text-white bg-blue-800 w-20 h-20 mt-4 rounded-full" />
          )}
        </div>

        {/* Selfie Photo Card */}
        <div
          className={`rounded-3xl p-8 shadow-sm flex flex-col items-center text-center border-5 border-transparent hover:border-blue-100 transition-all ${
            option === "SELFIE"
              ? "bg-blue-100 border-4 border-blue-700 transition-all"
              : "bg-white border-4 border-white hover:border-blue-100"
          } `}
          onClick={() => {
            if (!selfieId) setOption("SELFIE");
          }}
        >
          <div className="w-16 h-20 bg-blue-500 rounded-lg flex items-center justify-center mb-6 shadow-md">
            <div className="w-10 h-10 bg-slate-300 rounded-full border-2 border-white/50" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Selfie photo
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            To take a selfie <br /> Click here and click on `VERIFY MY IDENTITY`
          </p>

          <button
            disabled={true}
            className="flex items-center cursor-not-allowed gap-2 bg-gray-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Camera size={18} fill="currentColor" />
            <div className={`${selfieId && "text-red-700"}`}>Take a selfie</div>
          </button>
          {selfieId && (
            <CheckCircle2 className="text-white bg-blue-800 w-20 h-20 mt-4 rounded-full" />
          )}
        </div>

        {/* Primary Action Button */}
        <div className="pt-4">
          <button
            disabled={disabled}
            className={`w-full py-4 bg-slate-400 text-white ${disabled ? "cursor-not-allowed" : "cursor-pointer"}  font-bold rounded-xl  shadow-md transition-all uppercase tracking-wide text-sm`}
            onClick={handleVerifyMyID}
          >
            Verify my identity
          </button>
        </div>
      </div>
      {showModal && <VerificationModal />}
    </div>
  );
};

export default VerificationOption;
