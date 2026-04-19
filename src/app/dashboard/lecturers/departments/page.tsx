import DepartmentsSkeleton from '@/src/components/Dashboard/Department/DepartmentSkeleton/DepartmentSkeleton';
import { Suspense } from 'react';
import { fetchDepartments } from '@/src/lib/serverHelper';
import { IDepartmentsPageProps } from '@/src/components/Dashboard/Department/interface';
import Department from '@/src/components/Dashboard/Department/Department';

export default async function DepartmentsPage({
	searchParams,
}: IDepartmentsPageProps) {
	const initialData = await fetchDepartments(searchParams);

	return (
		<Suspense fallback={<DepartmentsSkeleton />}>
			<Department
				initialDepartments={initialData.data}
				initialMeta={initialData.meta}
				initialSearchTerm={(await searchParams).name || ''}
			/>
		</Suspense>
	);
}
