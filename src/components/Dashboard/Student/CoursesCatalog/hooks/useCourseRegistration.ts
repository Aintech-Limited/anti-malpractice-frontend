import { useState } from 'react';
import { Course } from '../interface';

export const useCourseRegistration = () => {
	const [registeredCourseIds, setRegisteredCourseIds] = useState<string[]>([]);
	const [isRegistering, setIsRegistering] = useState(false);

	const handleCourseSelect = async (course: Course) => {
		console.log('Selected course:', course);
		// Navigate to course materials or open modal
	};

	const handleRegister = async (course: Course) => {
		setIsRegistering(true);
		try {
			console.log('Registering for course:', course);
			// TODO: API call to register course
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
			setRegisteredCourseIds((prev) => [...prev, course.id]);
		} catch (error) {
			console.error('Registration failed:', error);
		} finally {
			setIsRegistering(false);
		}
	};

	return {
		registeredCourseIds,
		isRegistering,
		handleCourseSelect,
		handleRegister,
	};
};
