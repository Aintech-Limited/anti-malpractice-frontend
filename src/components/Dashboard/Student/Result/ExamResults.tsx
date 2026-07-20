"use client";

import { UserRoleTypeEnum } from "@/src/lib/enums";
import { IExamResultsProps } from "./interface";
import StudentExamResults from "./StudentExamResults";
import StaffExamResults from "./StaffExamResults";
import { useAuth } from "@/src/providers/auth/AuthContext";

export default function ExamResults({
  departments = [],
  exams = [],
  initialPage = 1,
  initialLimit = 50,
}: IExamResultsProps) {
  const { getUserRole } = useAuth();
  const role = getUserRole()!;
  if (role === UserRoleTypeEnum.USER) {
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
      departments={departments}
      exams={exams}
      initialPage={initialPage}
      initialLimit={initialLimit}
    />
  );
}
