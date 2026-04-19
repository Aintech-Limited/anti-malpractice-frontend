import { Suspense } from 'react';
import { IExamRegistrationPageProps } from '@/src/components/Dashboard/Student/ExamRegistration/interface';
import { LoadingSkeleton } from '@/src/components/Dashboard/Student/ExamRegistration/LoadingSkeleton/LoadingSkeleton';
import ExamRegistration from '@/src/components/Dashboard/Student/ExamRegistration/ExamRegistration';
import { fetchStudentsExamsRegistration } from '@/src/lib/serverHelper';

export default async function ExamRegistrationPage({
	searchParams,
}: IExamRegistrationPageProps) {
	const examsData = await fetchStudentsExamsRegistration(searchParams);

	return (
		<Suspense fallback={<LoadingSkeleton />}>
			<ExamRegistration
				initialExams={examsData.data}
				initialMeta={examsData.meta}
			/>
		</Suspense>
	);
}
