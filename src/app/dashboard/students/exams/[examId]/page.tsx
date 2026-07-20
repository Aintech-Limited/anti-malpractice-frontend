import LiveExamDetail from "@/src/components/Dashboard/Student/ExamChart/LiveExamDetail/LiveExamDetail";
import { ProtectedRouteEnum } from "@/src/lib/enums";
import { fetchLiveExamDetails } from "@/src/lib/serverHelper";
import { isUUID } from "class-validator";
import { redirect } from "next/navigation";

const LiveExamDetailsPage = async ({
  params,
}: {
  params: Promise<{ examId: string }>;
}) => {
  const { examId } = await params;
  const isValidId = isUUID(examId);
  if (!isValidId) redirect(ProtectedRouteEnum.STUDENTS);
  const initialData = await fetchLiveExamDetails(examId);
  return (
    <LiveExamDetail
      examDetail={initialData.data}
      message={initialData.message}
      success={initialData.success}
      statusCode={initialData.statusCode ?? 200}
    />
  );
};

export default LiveExamDetailsPage;
