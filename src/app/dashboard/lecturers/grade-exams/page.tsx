import { ProtectedRouteEnum } from "@/src/lib/enums";
import { redirect } from "next/navigation";

export default function GradeExamPage() {
  return redirect(ProtectedRouteEnum.LECTURERS);
}
