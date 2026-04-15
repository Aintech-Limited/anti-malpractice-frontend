import { ProgressBar } from '../ProgressBar/ProgressBar';
import { ICourseDetailsProps } from './interface';

export const CourseDetails = ({ course, status }: ICourseDetailsProps) => {
	return (
		<div className="mt-4 pt-4 border-t border-gray-200">
			{course.description && (
				<p className="text-gray-700 mb-3">{course.description}</p>
			)}

			{course.assignedLecturers && course.assignedLecturers.length > 0 && (
				<div className="mb-3 space-y-2">
					{course.assignedLecturers.map((lecturer, idx) => (
						<div key={idx}>
							<span className="text-sm font-medium text-gray-700">
								Lecturer:
							</span>
							<span className="text-sm text-black ml-2">
								{lecturer.lecturer.firstName} {lecturer.lecturer.lastName}
							</span>
							<br />
							{lecturer.role && (
								<>
									<span className="text-sm font-medium text-gray-700 ml-3">
										Role:
									</span>
									<span className="text-sm text-black ml-2">
										{lecturer.role?.replaceAll('_', ' ')}
									</span>
								</>
							)}
						</div>
					))}
				</div>
			)}

			{typeof course.isAssignedToMe === 'boolean' && (
				<p
					className={`${course.isAssignedToMe ? 'text-green-900' : 'text-gray-900'} mb-3`}
				>
					Assigned To Me: {course.isAssignedToMe ? 'TRUE' : 'FALSE'}
				</p>
			)}

			{course.prerequisite && course.prerequisite.length > 0 && (
				<div className="mb-3">
					<span className="text-sm font-medium text-gray-700">
						Prerequisites:
					</span>
					<span className="text-sm text-gray-600 ml-2">
						{course.prerequisite.join(', ')}
					</span>
				</div>
			)}

			{course.courseSchedules && course.courseSchedules.length > 0 && (
				<div>
					<span className="text-sm font-medium text-gray-700">Schedule:</span>
					<div className="mt-1 space-y-1">
						{course.courseSchedules.map((schedule, idx) => (
							<div key={idx} className="text-sm text-gray-600">
								{schedule.day.split('T')?.[0]}:{' '}
								{schedule.time
									? schedule.time.split('T')?.[1]?.slice(0, 6)
									: ''}{' '}
								@ {schedule.venue}
							</div>
						))}
						{course.courseSchedules.map((schedule, idx) => (
							<div key={idx} className="text-sm text-gray-600">
								<span className="text-sm text-gray-900 ml-2">
									Date: {schedule.day.slice(0, 11)}
								</span>
								<span className="text-sm text-gray-700 ml-2">
									Time:{' '}
									{schedule.time
										? schedule.time.split('T')?.[1]?.slice(0, 6)
										: ''}
								</span>
								<span className="text-sm text-black ml-2">
									Venue: {schedule.venue}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{status === 'registered' && course.progress !== undefined && (
				<ProgressBar progress={course.progress} />
			)}
		</div>
	);
};
