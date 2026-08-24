"use client";

import { UserRoleTypeEnum } from "@/src/lib/enums";
import { IExamResultsProps } from "./interface";
import StudentExamResults from "./StudentExamResults/StudentExamResults";
import StaffExamResults from "./StaffExamResults/StaffExamResults";
import { useAuth } from "@/src/providers/auth/AuthContext";

export default function ExamResults({
  initialPage = 1,
  initialLimit = 50,
}: IExamResultsProps) {
  const { getUserRole } = useAuth();
  const role = getUserRole()!;
  if (role === UserRoleTypeEnum.STUDENT) {
    return (
      <StudentExamResults
        initialPage={initialPage}
        initialLimit={initialLimit}
      />
    );
  }

  return (
    <StaffExamResults
      role={role}
      initialPage={initialPage}
      initialLimit={initialLimit}
    />
  );
}
