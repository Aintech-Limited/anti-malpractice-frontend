"use client";

import { memo, useState } from "react";
import { Sun, Users, Handshake, ArrowLeft } from "lucide-react";
import { profilesTypes } from "./data";
import { TChooseProfileProps } from "./interface";
import ProfileUpdateModal from "./ProfileUpdateModal/ProfileUpdateModal";
import { ProfileTypeEnumValue } from "@/src/lib/enums";
import { useAppDispatch, useAppSelector } from "@/src/redux/reduxStore";
import {
  setSignupState,
  setSignuptokenState,
} from "@/src/redux/features/signup/signup";
import { APP_NAME } from "@/src/lib/data";

const iconMap: Record<string, any> = {
  Sun: <Sun className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Handshake: <Handshake className="w-6 h-6" />,
} as const;

const SignupProfileSelector = memo(({ setStage }: TChooseProfileProps) => {
  const dispatch = useAppDispatch();
  const { signup, signupToken, signupType } = useAppSelector(
    (state) => state.asignup,
  );

  const [selectedProfile, setSelectedProfile] =
    useState<ProfileTypeEnumValue | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleGoBack = () => {
    setStage("form");
  };

  const handleSelectProfile = () => {
    if (!selectedProfile) return;

    if (signupType === "email") {
      dispatch(
        setSignupState({
          email: signup!.email,
          acceptTerms: signup!.acceptTerms,
          confirmPassword: signup!.confirmPassword,
          fullName: signup!.fullName,
          password: signup!.password,
          dob: signup?.dob,
          phoneContact: signup?.phoneContact,
          sex: signup?.sex,
          profileType: selectedProfile,
        }),
      );
    }

    if (signupType === "google") {
      dispatch(
        setSignuptokenState({
          idToken: signupToken!.idToken,
          acceptTerms: signupToken!.acceptTerms,
          dob: signupToken?.dob,
          phoneContact: signupToken?.phoneContact,
          sex: signupToken?.sex,
          profileType: selectedProfile,
        }),
      );
    }
    setShowModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-white font-sans text-slate-900 px-6 py-8 flex flex-col items-center">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="font-bold text-lg tracking-tight">{APP_NAME}</h1>

          {/* Progress Bar */}
          <div className="flex justify-center gap-2 mt-6">
            <div className="h-1 w-16 bg-slate-200 rounded-full" />
            <div className="h-1 w-16 bg-slate-300 rounded-full" />
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full max-w-5xl gap-7">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              How do you plan to use {APP_NAME} today?
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Don&apos;t worry, you can switch between profiles anytime.
            </p>
          </div>

          {/* Back Button */}
          <button
            className="flex items-center gap-2 text-slate-600 hover:text-black transition-colors mb-6 md:absolute md:left-10 lg:left-20"
            onClick={handleGoBack}
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Profile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 mt-20">
            {profilesTypes.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfile(profile.type)}
                className={`flex flex-col items-center p-8 rounded-xl border-2 transition-all duration-200 text-center h-full
                ${
                  selectedProfile === profile.type
                    ? "border-blue-600 bg-blue-50/30"
                    : "border-slate-100 hover:border-slate-300"
                }`}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  {iconMap[profile.icon]}
                </div>
                <p className="text-sm leading-relaxed text-slate-800">
                  {profile.text}
                </p>
              </button>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              disabled={selectedProfile === null}
              className={`w-full md:w-80 py-4 rounded-lg font-semibold transition-all
              ${
                selectedProfile !== null
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
              onClick={() => handleSelectProfile()}
            >
              Choose a profile
            </button>
          </div>
        </main>
      </div>
      <ProfileUpdateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
});

SignupProfileSelector.displayName = "SignupProfileSelector";

export default SignupProfileSelector;
