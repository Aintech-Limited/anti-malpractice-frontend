import AdminComplaintsManager from '@/src/components/Dashboard/Admin/ComplaintManager/ComplaintManager';
import { getAdminComplaints } from '@/src/lib/serverHelper';

export default async function ComplaintFormPage() {
	const complaints = await getAdminComplaints();
	return (
		<AdminComplaintsManager
			initialComplaints={complaints?.data || []}
			message={complaints?.message ?? ''}
			meta={complaints?.meta}
			success={complaints?.success}
		/>
	);
}
