import ExamRegistered from '@/src/components/Dashboard/Lecturer/Exams/ExamRegistrations/ExamRegistrations';
import { IIExamRegistrationsPageProps } from '@/src/components/Dashboard/Lecturer/Exams/ExamRegistrations/interface';
import { RegistrationsSkeleton } from '@/src/components/Dashboard/Lecturer/Exams/ExamRegistrations/LoadingSkeleton/LoadingSkeleton';
import {
	fetchExamDetails,
	fetchExamRegistrations,
} from '@/src/lib/serverHelper';
import { Suspense } from 'react';

export default async function ExamRegistrationsPage({
	params,
	searchParams,
}: IIExamRegistrationsPageProps) {
	const { examId } = await params;
	const [registrationsData, examData] = await Promise.all([
		fetchExamRegistrations(examId, searchParams),
		fetchExamDetails(examId),
	]);

	return (
		<Suspense fallback={<RegistrationsSkeleton />}>
			<ExamRegistered
				initialRegistrations={registrationsData.data}
				initialMeta={registrationsData.meta}
				exam={examData?.data}
				examId={examId}
				initialFilters={{
					page: parseInt((await searchParams).page || '1'),
					limit: parseInt((await searchParams).limit || '20'),
					sortBy: (await searchParams).sortBy || 'registeredAt',
					sortOrder: (await searchParams).sortOrder || 'DESC',
					status: (await searchParams).status || '',
					level: (await searchParams).level || '',
					semester: (await searchParams).semester || '',
				}}
			/>
		</Suspense>
	);
}
