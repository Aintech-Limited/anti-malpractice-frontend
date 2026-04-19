import { useState, useMemo } from 'react';
import { ICourse, IDepartment, TCourseStatus } from '../interface';

export const useCourseCatalog = (
	departments: IDepartment[],
	activeSemester: number = 1,
	registeredCourseIds: string[],
) => {
	const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(
		new Set(),
	);
	const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
		new Set(),
	);

	const getCourseStatus = (course: ICourse): TCourseStatus => {
		if (registeredCourseIds.includes(course.id)) {
			return 'registered';
		}
		if (course.semester === activeSemester && course.level <= 2) {
			return 'active';
		}
		if (course.prerequisite && course.prerequisite.length > 0) {
			const hasPrerequisites = course.prerequisite.every((prereq) =>
				registeredCourseIds.includes(prereq),
			);
			if (!hasPrerequisites) return 'locked';
		}
		return 'available';
	};

	const filteredDepartments = useMemo(() => {
		return departments && departments.length > 0
			? departments
					?.map((dept) => ({
						...dept,
						courses: dept.courses.filter((course) => {
							const matchesSearch =
								searchQuery === '' ||
								course.title
									.toLowerCase()
									.includes(searchQuery.toLowerCase()) ||
								course.courseCode
									.toLowerCase()
									.includes(searchQuery.toLowerCase());

							const matchesLevel =
								selectedLevel === 'all' || course.level === selectedLevel;

							return matchesSearch && matchesLevel;
						}),
					}))
					?.filter((dept) => dept.courses.length > 0)
			: [];
	}, [departments, searchQuery, selectedLevel]);

	const toggleDepartment = (deptId: string) => {
		setExpandedDepartments((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(deptId)) {
				newSet.delete(deptId);
			} else {
				newSet.add(deptId);
			}
			return newSet;
		});
	};

	const toggleCourseDetails = (courseId: string) => {
		setExpandedCourses((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(courseId)) {
				newSet.delete(courseId);
			} else {
				newSet.add(courseId);
			}
			return newSet;
		});
	};

	return {
		expandedDepartments,
		selectedLevel,
		searchQuery,
		expandedCourses,
		filteredDepartments,
		getCourseStatus,
		setSelectedLevel,
		setSearchQuery,
		toggleDepartment,
		toggleCourseDetails,
	};
};
