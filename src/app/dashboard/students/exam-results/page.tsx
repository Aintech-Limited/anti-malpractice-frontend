import ExamResults from '@/src/components/Dashboard/Student/Result/ExamResults';

export default async function ExamResultsPage() {
	return (
		<ExamResults
			departments={[]}
			exams={[]}
			initialPage={1}
			initialLimit={20}
		/>
	);
}
