import CoursesClient from "@/src/components/Dashboard/Admin/Departments/Courses/Courses";
import { IDepartmetCoursesPageProps } from "@/src/components/Dashboard/Admin/Departments/Courses/interface";
import { extractQueryParams } from "@/src/lib/helper";
import serverAction from "@/src/lib/serverHelper";

export default async function DepartmentalCoursesPage({
  params,
  searchParams,
}: IDepartmetCoursesPageProps) {
  const { departmentId } = await params;
  const { creditHours, level, limit, page, semester, status } =
    await extractQueryParams<IDepartmetCoursesPageProps["searchParams"]>(
      searchParams,
    );
  const response = await (
    await serverAction()
  ).admins.fetchAdminDepartmentCourses(departmentId, {
    creditHours: creditHours ? Number(creditHours) : undefined,
    level: level ? Number(level) : undefined,
    limit: limit ? Number(limit) : 20,
    page: page ? Number(page) : 1,
    semester: semester ? Number(semester) : undefined,
    status: !status ? undefined : status,
  });
  return (
    <CoursesClient
      departmentId={departmentId}
      initialData={response}
      initialPage={page ? Number(page) : 1}
      limit={limit ? Number(limit) : 20}
    />
  );
}
