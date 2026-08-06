import StudentDashboard from "@/src/components/Dashboard/Student/StudentDashboard";
import { fetchStudentDashboard } from "@/src/lib/serverHelper";

const StudentDashboardPage = async () => {
  const initialData = await fetchStudentDashboard();
  return <StudentDashboard initialData={initialData.data} />;
};

export default StudentDashboardPage;
