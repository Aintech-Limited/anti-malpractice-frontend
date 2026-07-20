import ExamsClient from "@/src/components/Dashboard/Admin/Exams/Exam";
import { IAdminExamsPageProps } from "@/src/components/Dashboard/Admin/Exams/interface";
import {
  TAdminExamStatusValue,
  TAdminExamTypeEnumValue,
} from "@/src/lib/enums";
import { extractQueryParams } from "@/src/lib/helper";
import serverAction from "@/src/lib/serverHelper";

export default async function ExamsPage({
  searchParams,
}: IAdminExamsPageProps) {
  const {
    page,
    limit,
    search,
    adminStatus,
    type_,
    departmentId,
    courseId,
    startDate,
    endDate,
    published,
  } =
    await extractQueryParams<IAdminExamsPageProps["searchParams"]>(
      searchParams,
    );

  const [examsData, departments, courses] = await Promise.all([
    await (
      await serverAction()
    ).admins.fetchAdminExams({
      page: Number(page ?? "1"),
      limit: Number(page ?? "20"),
      search,
      adminStatus: adminStatus as TAdminExamStatusValue | undefined,
      type_: type_ as TAdminExamTypeEnumValue | undefined,
      departmentId,
      courseId,
      published: published === undefined ? undefined : published === "true",
      startDate,
      endDate,
    }),
    await (await serverAction()).admins.fetchAdminExamDepartments(),
    await (await serverAction()).admins.fetchAdminCourses(departmentId),
  ]);

  return (
    <ExamsClient
      initialData={examsData}
      initialPage={page ? Number(page) : 1}
      limit={limit ? Number(limit) : 20}
      departments={departments}
      courses={courses}
    />
  );
}
