import { formatCredits, getLevelLabel } from '@/src/lib/helper';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { ICourseHeaderProps } from './interface';
import { StatusButton } from '../StatusButton/StatusButton';

export const CourseHeader = ({
	course,
	status,
	isExpanded,
	isRegistering = false,
	onToggleDetails,
	onCourseSelect,
	onRegister,
}: ICourseHeaderProps) => {
	return (
		<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
			<div className="flex-1">
				<div className="flex items-center gap-3 flex-wrap">
					<h3 className="text-lg font-semibold text-gray-900">
						{course.courseCode}: {course.title}
					</h3>
					<StatusBadge status={status} />
				</div>
				<div className="flex gap-4 mt-1 text-sm text-gray-600">
					<span>{formatCredits(course.credits)}</span>
					<span>{getLevelLabel(course.level)}</span>
					<span>Semester {course.semester}</span>
				</div>
			</div>
			<div className="flex gap-2">
				<StatusButton
					course={course}
					status={status}
					isRegistering={isRegistering}
					onCourseSelect={onCourseSelect}
					onRegister={onRegister}
				/>
				<button
					onClick={onToggleDetails}
					className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
				>
					{isExpanded ? 'Hide Details' : 'Show Details'}
				</button>
			</div>
		</div>
	);
};
