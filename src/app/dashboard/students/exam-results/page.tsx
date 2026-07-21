import ExamResults from '@/src/components/Dashboard/Student/Result/ExamResults';

export default async function ExamResultsPage() {
	return <ExamResults initialPage={1} initialLimit={50} />;
}
