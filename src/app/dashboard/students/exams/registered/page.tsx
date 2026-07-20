import { IRegisteredExamsPageProps } from "@/src/components/Dashboard/Student/RegisteredExam/interface";
import { ExamsSkeleton } from "@/src/components/Dashboard/Student/RegisteredExam/LoadingSkeleton/LoadingSkeleton";
import RegisteredExams from "@/src/components/Dashboard/Student/RegisteredExam/RegisteredExam";
import { fetchRegisteredExams } from "@/src/lib/serverHelper";
import { Suspense } from "react";

export default async function RegisteredExamsPage({
  searchParams,
}: IRegisteredExamsPageProps) {
  const examsData = await fetchRegisteredExams(searchParams);

  return (
    <Suspense fallback={<ExamsSkeleton />}>
      <RegisteredExams
        initialExams={examsData.data}
        initialMeta={examsData.meta}
        initialFilters={{
          page: parseInt((await searchParams).page || "1"),
          limit: parseInt((await searchParams).limit || "20"),
          sortBy: (await searchParams).sortBy || "registeredAt",
          sortOrder: (await searchParams).sortOrder || "DESC",
          status: (await searchParams).status || "",
        }}
      />
    </Suspense>
  );
}
