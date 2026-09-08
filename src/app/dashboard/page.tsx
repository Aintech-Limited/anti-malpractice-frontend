import Dashboard from "@/src/components/Dashboard/Dashboard";
import { ProtectedRouteEnum, UserRoleTypeEnum } from "@/src/lib/enums";
import { getUserProfile } from "@/src/lib/serverHelper";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUserProfile();
  switch (user?.data?.role) {
    case UserRoleTypeEnum.ADMIN:
      redirect(ProtectedRouteEnum.ADMINS);

    case UserRoleTypeEnum.STUDENT:
      redirect(ProtectedRouteEnum.STUDENTS);

    case UserRoleTypeEnum.LECTURER:
      redirect(ProtectedRouteEnum.LECTURERS);

    case UserRoleTypeEnum.VENDOR:
      redirect(ProtectedRouteEnum.VENDORS);
  }

  return <Dashboard />;
}
