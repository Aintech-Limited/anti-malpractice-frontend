import { ICourseStudentsPageProps } from '@/src/components/Dashboard/Admin/Departments/Courses/Students/interface';
import StudentsClient from '@/src/components/Dashboard/Admin/Departments/Courses/Students/Students';
import { fetchAdminCourseStudents } from '@/src/lib/serverHelper';

export default async function CourseStudentsPage({
	params,
	searchParams,
}: ICourseStudentsPageProps) {
	const {
		emailVerified,
		faceAuthEnabled,
		isBlocked,
		level,
		limit,
		page,
		search,
	} = await searchParams;
	const courseId = (await params).courseId;
	const page_ = page ? parseInt(page) : 1;
	const limit_ = limit ? parseInt(limit) : 10;
	const search_ = search;
	const faceAuthEnabled_ = faceAuthEnabled
		? faceAuthEnabled === 'true'
		: undefined;
	const isBlocked_ = isBlocked ? isBlocked === 'true' : undefined;
	const emailVerified_ = emailVerified ? emailVerified === 'true' : undefined;
	const level_ = level ? parseInt(level) : undefined;

	const [studentsData] = await Promise.all([
		fetchAdminCourseStudents(courseId, {
			page: page_,
			limit: limit_,
			search,
			faceAuthEnabled: faceAuthEnabled_,
			isBlocked: isBlocked_,
			emailVerified: emailVerified_,
			level: level_,
		}),
	]);

	return (
		<StudentsClient
			courseId={courseId}
			initialData={studentsData}
			initialPage={page_}
			limit={limit_}
		/>
	);
}
