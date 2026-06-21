import AdminComplaintsManager from '@/src/components/Dashboard/Admin/ComplaintManager/ComplaintManager';
import { initialComplaints } from '@/src/components/Dashboard/Admin/ComplaintManager/data';

export default function ComplaintFormPage() {
	return <AdminComplaintsManager initialComplaints={initialComplaints} />;
}
