import LecturerDashboard from "@/src/components/Dashboard/Lecturer/LecturerDashboard";
import serverAction from "@/src/lib/serverHelper";

const LecturerDashboardPage = async () => {
  const data = await (await serverAction()).lecturers.fetchDashboard("id");
  return <LecturerDashboard initialData={data} />;
};
export default LecturerDashboardPage;
