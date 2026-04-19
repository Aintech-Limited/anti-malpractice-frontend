import Exams from '@/src/components/Dashboard/Lecturer/Exams/Exam';
import { IExamsPageProps } from '@/src/components/Dashboard/Lecturer/Exams/interface';
import { ExamsSkeleton } from '@/src/components/Dashboard/Lecturer/Exams/LoadingSkeleton/LoadingSkeleton';
import { fetchCourseAssignments, fetchExams } from '@/src/lib/serverHelper';
import { Suspense } from 'react';

export default async function ExamsPage({ searchParams }: IExamsPageProps) {
	const [examsData, coursesData] = await Promise.all([
		fetchExams(searchParams),
		fetchCourseAssignments(),
	]);

	return (
		<Suspense fallback={<ExamsSkeleton />}>
			<Exams
				initialExams={examsData.data}
				initialMeta={examsData.meta}
				availableCourses={coursesData.data}
				initialFilters={{
					page: parseInt((await searchParams).page || '1'),
					limit: parseInt((await searchParams).limit || '10'),
					status: (await searchParams).status || '',
					type_: (await searchParams).type_ || '',
					sortBy: (await searchParams).sortBy || 'createdAt',
					sortOrder: (await searchParams).sortOrder || 'DESC',
				}}
			/>
		</Suspense>
	);
}
