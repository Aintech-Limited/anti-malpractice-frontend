'use client';

import { useAuth } from '@/src/providers/auth/AuthContext';
import { IStatusButtonProps } from './interface';

export const StatusButton = ({
	course,
	status,
	isRegistering = false,
	onCourseSelect,
	onRegister,
}: IStatusButtonProps) => {
	const { user } = useAuth();
	if (user?.role === 'STAFF') {
		return null;
	}

	if (course.isRegistered) {
		return (
			<button
				onClick={() => onCourseSelect(course, 'continue_learning')}
				className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
			>
				Continue Learning
			</button>
		);
	}

	switch (status) {
		case 'registered':
			return (
				<button
					onClick={() => onCourseSelect(course, 'continue_learning')}
					className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
				>
					Continue Learning
				</button>
			);
		case 'active':
			return (
				<button
					onClick={() => onCourseSelect(course, 'register')}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
				>
					Start Course
				</button>
			);
		case 'available':
			return (
				<button
					onClick={() => onRegister(course)}
					disabled={isRegistering}
					className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
				>
					{isRegistering ? 'Registering...' : 'Register'}
				</button>
			);
		case 'locked':
			return (
				<button
					disabled
					className="px-4 py-2 bg-gray-300 cursor-not-allowed text-gray-500 text-sm font-medium rounded-lg"
					title="Complete prerequisites first"
				>
					Locked
				</button>
			);
		default:
			return null;
	}
};
