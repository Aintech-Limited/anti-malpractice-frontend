import ExamResults from "@/src/components/Dashboard/Student/Result/ExamResults";
import { ProtectedRouteEnum } from "@/src/lib/enums";
import { isUUID } from "class-validator";
import { redirect } from "next/navigation";

export default async function ExamResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ resultId?: string }>;
}) {
  const { resultId } = await searchParams;
  if (resultId && !isUUID(resultId)) {
    redirect(ProtectedRouteEnum.DASHBOARD);
  }
  return <ExamResults initialPage={1} initialLimit={50} resultId={resultId} />;
}
