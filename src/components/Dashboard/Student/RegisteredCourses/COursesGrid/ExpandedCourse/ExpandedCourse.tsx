'use client';

import { useRouter } from 'next/navigation';
import { IExpandedCourseProps } from './interface';
import { CheckCircle } from 'lucide-react';

const ExpandedCourse = ({
	course,
	handleViewMaterials,
}: IExpandedCourseProps) => {
	const router = useRouter();
	return (
		<div className="mt-6 pt-6 border-t border-gray-200">
			{/* Assignments */}
			{course.assignments && course.assignments.length > 0 && (
				<div className="mb-6">
					<h4 className="text-sm font-semibold text-gray-900 mb-3">
						Upcoming Assignments
					</h4>
					<div className="space-y-2">
						{course.assignments.map((assignment) => (
							<div
								key={assignment.id}
								className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
							>
								<div>
									<p className="text-sm font-medium text-gray-900">
										{assignment.title}
									</p>
									<p className="text-xs text-gray-500">
										Due: {new Date(assignment.dueDate).toLocaleDateString()}
									</p>
								</div>
								<span
									className={`text-xs font-medium px-2 py-1 rounded-full ${
										assignment.status === 'submitted'
											? 'bg-green-100 text-green-700'
											: assignment.status === 'graded'
												? 'bg-blue-100 text-blue-700'
												: 'bg-yellow-100 text-yellow-700'
									}`}
								>
									{assignment.status === 'submitted' && (
										<CheckCircle className="w-3 h-3 inline mr-1" />
									)}
									{assignment.status.charAt(0).toUpperCase() +
										assignment.status.slice(1)}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Quick Actions */}
			<div className="flex gap-3">
				<button
					onClick={() => handleViewMaterials(course)}
					className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
				>
					View All Materials
				</button>
				<button
					onClick={() =>
						router.push(`/dashboard/students/courses/discussion?q=${course.id}`)
					}
					disabled
					className="flex-1 px-4 py-2 cursor-not-allowed border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
				>
					Join Discussion
				</button>
			</div>
		</div>
	);
};

export default ExpandedCourse;
