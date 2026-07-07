import ComplaintsClient from '@/src/components/Dashboard/Student/Complaint/AllComplaints/AllComplaints';
import { IComplaintsPageProps } from '@/src/components/Dashboard/Student/Complaint/AllComplaints/interface';
import { getStudentComplaints } from '@/src/lib/serverHelper';

export default async function ComplaintsPage({
	searchParams,
}: IComplaintsPageProps) {
	const resolvedParams = await searchParams;

	const filters = {
		page: resolvedParams.page || '1',
		limit: resolvedParams.limit || '20',
		status: resolvedParams.status || undefined,
		search: resolvedParams.search || undefined,
		category: resolvedParams.category || undefined,
		sortBy: resolvedParams.sortBy || 'createdAt',
		sortOrder: resolvedParams.sortOrder || 'ASC',
	};

	const response = await getStudentComplaints(filters);

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-6">
					Student Complaints
				</h1>
				<ComplaintsClient
					initialData={response.data || []}
					meta={response.meta || {}}
					currentFilters={filters}
				/>
			</div>
		</div>
	);
}
