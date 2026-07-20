import DepartmentsClient from "@/src/components/Dashboard/Admin/Departments/Departments";
import { IDepartmentsPageProps } from "@/src/components/Dashboard/Department/interface";
import serverAction from "@/src/lib/serverHelper";
import { isNumber } from "class-validator";

export default async function DepartmentsPage({
  searchParams,
}: IDepartmentsPageProps) {
  const page = (await searchParams).page;
  const limit = (await searchParams).limit;

  const initialData = await (
    await serverAction()
  ).admins.fetchAdminDepartments(
    isNumber(page) ? Number(page) : 1,
    isNumber(limit) ? Number(limit) : 20,
  );

  return (
    <DepartmentsClient
      initialData={initialData}
      initialPage={isNumber(page) ? Number(page) : 1}
      limit={isNumber(limit) ? Number(limit) : 20}
    />
  );
}
