import Students from "@/src/components/Dashboard/Admin/Students/Students";
import { getStudentManagenemt } from "@/src/lib/serverHelper";

export default async function StudentsPage() {
  const data = await getStudentManagenemt();
  return <Students initialData={data} />;
}
