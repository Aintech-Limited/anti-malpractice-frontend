import { IDepartmentStudentsPageProps } from "@/src/components/Dashboard/Admin/Departments/Students/interface";
import DepartmentStudentsClient from "@/src/components/Dashboard/Admin/Departments/Students/Students";
import { ProtectedRouteEnum } from "@/src/lib/enums";
import { fetchDepartmentalStudents } from "@/src/lib/serverHelper";
import { isNumber, isUUID } from "class-validator";
import { redirect } from "next/navigation";

export default async function DepartmentStudentsPage({
  params,
  searchParams,
}: IDepartmentStudentsPageProps) {
  const departmentId = (await params).departmentId;
  const isValid = isUUID(departmentId);
  if (!isValid) redirect(ProtectedRouteEnum.ADMINS);
  const page = (await searchParams).page;
  const parsedPage = page && isNumber(page) ? parseInt(page) : 1;
  const limit = (await searchParams).limit;
  const parsedLimit = limit && isNumber(limit) ? parseInt(limit) : 20;

  const initialData = await fetchDepartmentalStudents(
    departmentId,
    parsedPage,
    parsedLimit,
  );

  return (
    <DepartmentStudentsClient
      departmentId={departmentId}
      initialData={initialData}
      initialPage={parsedPage}
      limit={parsedLimit}
    />
  );
}
