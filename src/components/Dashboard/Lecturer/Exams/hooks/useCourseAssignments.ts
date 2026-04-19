'use client';

import { useState } from 'react';
import { ICourseAssignment } from '../interface';

export const useCourseAssignments = (initialCourses: ICourseAssignment[]) => {
	const [courses, setCourses] = useState<ICourseAssignment[]>(initialCourses);
	const [loading, setLoading] = useState(false);

	const fetchCourses = async () => {
		setLoading(true);
		try {
			const response = await fetch('/api/v1/course-assignments/staff');
			const data = await response.json();
			if (data.success) {
				setCourses(data.data);
			}
		} catch (error) {
			console.error('Failed to fetch courses:', error);
		} finally {
			setLoading(false);
		}
	};

	return {
		courses,
		loading,
		fetchCourses,
	};
};
