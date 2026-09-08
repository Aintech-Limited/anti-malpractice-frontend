import FaceAuthEnrollment from "@/src/components/Dashboard/Student/FaceAuthEnrollment/FaceAuthEnrollment";
import { ProtectedRouteEnum } from "@/src/lib/enums";
import { getUserProfile } from "@/src/lib/serverHelper";
import { redirect } from "next/navigation";

export default async function FaceAuthEnrollmentPage() {
  const user = await getUserProfile();
  if (user?.data?.faceAuthEnabled) redirect(ProtectedRouteEnum.STUDENTS);

  return <FaceAuthEnrollment />;
}
