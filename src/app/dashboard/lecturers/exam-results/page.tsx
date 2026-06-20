import ExamResults from '@/src/components/Dashboard/Student/Result/ExamResults';
import serverAction from '@/src/lib/serverHelper';

export default async function ExamResultsPage() {
	const departments: { id: string; name: string }[] = await (
		await serverAction()
	).admins.fetchAdminDeptSelect();
	const exams: { id: string; title: string }[] = await (
		await serverAction()
	).admins.fetchAdminCourseSelect();

	return (
		<ExamResults
			departments={departments}
			exams={exams}
			initialPage={1}
			initialLimit={50}
		/>
	);
}
