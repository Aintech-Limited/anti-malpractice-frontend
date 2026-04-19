import CourseMaterials from '@/src/components/Dashboard/Lecturer/CourseMaterials/CourseMaterials';
import { ICourseMaterialsPageProps } from '@/src/components/Dashboard/Lecturer/CourseMaterials/interface';
import { MaterialsSkeleton } from '@/src/components/Dashboard/Lecturer/CourseMaterials/LoadingSkeleton/LoadingSkeleton';
import {
	fetchAssignedCourses,
	fetchCourseMaterials,
} from '@/src/lib/serverHelper';
import { Suspense } from 'react';

export default async function CourseMaterialsPage({
	searchParams,
}: ICourseMaterialsPageProps) {
	const [materialsData, coursesData] = await Promise.all([
		fetchCourseMaterials(searchParams),
		fetchAssignedCourses(),
	]);

	return (
		<Suspense fallback={<MaterialsSkeleton />}>
			<CourseMaterials
				initialMaterials={materialsData.data}
				initialMeta={materialsData.meta}
				assignedCourses={coursesData.data}
				initialFilters={{
					page: parseInt((await searchParams).page || '1'),
					limit: parseInt((await searchParams).limit || '10'),
					sortBy: (await searchParams).sortBy || 'createdAt',
					sortOrder: (await searchParams).sortOrder || 'DESC',
					fileType: (await searchParams).fileType || '',
					isFree: (await searchParams).isFree || '',
					search: (await searchParams).search || '',
				}}
			/>
		</Suspense>
	);
}
