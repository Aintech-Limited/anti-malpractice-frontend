import { ILecturersPageProps } from "@/src/components/Dashboard/Admin/Lecturers/interface";
import LecturersClient from "@/src/components/Dashboard/Admin/Lecturers/Lectuters";
import { extractQueryParams } from "@/src/lib/helper";
import serverAction from "@/src/lib/serverHelper";

export const extractParams = () => {};

export default async function LecturersPage({
  searchParams,
}: ILecturersPageProps) {
  const {
    page,
    limit,
    search,
    departmentId,
    isActive,
    idVerified,
    selfieVerified,
  } =
    await extractQueryParams<ILecturersPageProps["searchParams"]>(searchParams);

  const [lecturersData, departments] = await Promise.all([
    await (
      await serverAction()
    ).admins.fetchAdminLecturers({
      page: Number(page),
      limit: Number(limit),
      search,
      departmentId,
      isActive: isActive === undefined ? undefined : Boolean(isActive),
      idVerified: idVerified === undefined ? undefined : Boolean(idVerified),
      selfieVerified:
        selfieVerified === undefined ? undefined : Boolean(selfieVerified),
    }),
    await (await serverAction()).admins.fetchAdminDepartments(),
  ]);

  return (
    <LecturersClient
      initialData={lecturersData}
      initialPage={Number(page ?? "1")}
      limit={Number(limit ?? "20")}
      departments={departments.data}
    />
  );
}
