import LecturerIDVerificationClient from "@/src/components/Dashboard/LecturerIDVerificationClient/LecturerIDVerificationClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `ID Verification | FINDU Dashboard`,
  description: "Know your Customer.",
};
export default function VerifyPage() {
  return <LecturerIDVerificationClient />;
}
