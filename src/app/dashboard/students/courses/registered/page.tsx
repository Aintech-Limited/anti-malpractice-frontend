import { Suspense } from 'react';
import { fetchRegisteredCourses } from '@/src/lib/serverHelper';
import { RegisteredCoursesSkeleton } from '@/src/components/Dashboard/Student/RegisteredCourses/RegisteredCoursesSkeleton/RegisteredCoursesSkeleton';
import RegisteredCourses from '@/src/components/Dashboard/Student/RegisteredCourses/RegisteredCourses';

export default async function RegisteredCoursesPage() {
	const { success, data, message, meta } = await fetchRegisteredCourses();
	// console.log('data: ', data);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						My Registered Courses
					</h1>
					<p className="text-gray-600 mt-2">
						Track your progress and continue learning
					</p>
				</div>

				<Suspense fallback={<RegisteredCoursesSkeleton />}>
					<RegisteredCourses
						courses={data}
						meta={meta}
						error={!success ? message : null}
					/>
				</Suspense>
			</div>
		</div>
	);
}
