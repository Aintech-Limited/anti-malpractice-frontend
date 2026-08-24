"use client";

import { useEffect, useState } from "react";
import { TVerifyStage } from "./interface";
import GovernmentId from "./GovernmentIdOptions/GovernmentIdOptions";
import IDCapture from "./IDCapture/IDCapture";
import VerificationOption from "./VerificationOption/VerificationOptions";
import SelfieCapture from "./SelfieCapture/SelfieCapture";
import { useAuth } from "@/src/providers/auth/AuthContext";
import { useRouter } from "next/navigation";
import { UserRoleTypeEnum, ProtectedRouteEnum } from "@/src/lib/enums";

export default function Verify() {
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    if (user?.isIdVerified) window.history.back();
    if (user?.profileType === UserRoleTypeEnum.STUDENT)
      router.push(ProtectedRouteEnum.DASHBOARD);
  }, [user, router]);

  const [stage, setstage] = useState<TVerifyStage>("VERIFICATION_OPTIONS");

  if (stage === "GOVERNMENT") return <GovernmentId setStage={setstage} />;
  if (stage === "SELFIE") return <SelfieCapture setStage={setstage} />;
  if (stage === "ID_CAPTURE") return <IDCapture setStage={setstage} />;
  if (stage === "VERIFICATION_OPTIONS")
    return <VerificationOption setStage={setstage} />;
}
