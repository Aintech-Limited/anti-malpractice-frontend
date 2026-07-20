import GradeExamClient from "@/src/components/Dashboard/Lecturer/GradeExam/GradeExam";
import { IGradeExamPageProps } from "@/src/components/Dashboard/Lecturer/GradeExam/interface";
import { ProtectedRouteEnum } from "@/src/lib/enums";
import { getUngradedQuestions } from "@/src/lib/serverHelper";
import { isUUID } from "class-validator";
import { redirect } from "next/navigation";

export default async function GradeExamPage({
  params,
  searchParams,
}: IGradeExamPageProps) {
  const { examId } = await params;
  const { limit, page } = await searchParams;
  if (!isUUID(examId ?? "")) redirect(ProtectedRouteEnum.LECTURERS);

  const initialQuestions = await getUngradedQuestions(
    examId,
    parseInt(page ?? "1"),
    parseInt(limit ?? "100"),
  );

  return (
    <GradeExamClient
      examId={examId}
      examTitle={initialQuestions.data.examTitle}
      initialQuestionsData={initialQuestions}
    />
  );
}
