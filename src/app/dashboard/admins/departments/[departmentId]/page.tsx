import { redirect } from "next/navigation";

export default async function DepartmentPage() {
  return redirect("/dashboard/admins/departments");
}
