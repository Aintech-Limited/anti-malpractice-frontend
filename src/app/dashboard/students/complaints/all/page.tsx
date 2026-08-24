import ComplaintsClient from "@/src/components/Dashboard/Student/Complaint/AllComplaints/AllComplaints";
import { IComplaintsPageProps } from "@/src/components/Dashboard/Student/Complaint/AllComplaints/interface";
import { getStudentComplaints } from "@/src/lib/serverHelper";

export default async function ComplaintsPage({}: IComplaintsPageProps) {
  const response = await getStudentComplaints({
    page: "1",
    limit: "50",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Student Complaints
        </h1>
        <ComplaintsClient
          initialData={response.data || []}
          meta={response.meta || {}}
          currentFilters={{
            page: "1",
            limit: "50",
          }}
        />
      </div>
    </div>
  );
}
