import AdminDashboard from '@/src/components/Dashboard/Admin/AdminDashboard';
import serverAction from '@/src/lib/serverHelper';

export default async function AdminDashboardPage() {
	const initialData = await (await serverAction()).admins.fetchAdminDashboard();
	return <AdminDashboard initialData={initialData} />;
}
