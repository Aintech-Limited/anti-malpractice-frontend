import CoursesClient from "@/src/components/Dashboard/Admin/Departments/Courses/Courses";
import { IDepartmetCoursesPageProps } from "@/src/components/Dashboard/Admin/Departments/Courses/interface";
import { fetchAdminDepartmentCourses } from "@/src/lib/serverHelper";
import { isNumber } from "class-validator";

export default async function CoursesPage({
  params,
  searchParams,
}: IDepartmetCoursesPageProps) {
  const departmentId = (await params).departmentId;
  const page = (await searchParams).page;
  const paredPage = isNumber(page) ? parseInt(page) : 1;
  const limit = (await searchParams).limit;
  const paredLimit = isNumber(limit) ? parseInt(limit) : 20;
  const creditHours = (await searchParams).creditHours;
  const paredCreditHours = isNumber(creditHours)
    ? parseInt(creditHours)
    : undefined;
  const semester = (await searchParams).semester;
  const paredSemester = isNumber(semester) ? parseInt(semester) : undefined;
  const level = (await searchParams).level;
  const paredLevel = isNumber(level) ? parseInt(level) : undefined;
  const status = (await searchParams).status as any;

  const initialData = await fetchAdminDepartmentCourses(departmentId, {
    page: paredPage,
    limit: paredLimit,
    creditHours: paredCreditHours,
    semester: paredSemester,
    level: paredLevel,
    status,
  });

  return (
    <CoursesClient
      departmentId={departmentId}
      initialData={initialData}
      initialPage={paredPage}
      limit={paredLimit}
    />
  );
}
