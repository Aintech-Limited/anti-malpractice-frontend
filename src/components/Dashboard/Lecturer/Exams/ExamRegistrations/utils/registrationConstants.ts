export const REGISTRATION_STATUS = {
	REGISTERED: {
		label: 'Registered',
		color: 'bg-green-100 text-green-800',
		borderColor: 'border-green-200',
	},
	IN_PROGRESS: {
		label: 'In Progress',
		color: 'bg-yellow-100 text-yellow-800',
		borderColor: 'border-yellow-200',
	},
	CANCELLED: {
		label: 'Cancelled',
		color: 'bg-red-100 text-red-800',
		borderColor: 'border-red-200',
	},
	FAILED: {
		label: 'Failed',
		color: 'bg-gray-100 text-gray-800',
		borderColor: 'border-gray-200',
	},
} as const;

export const SORT_OPTIONS = [
	{ value: 'registeredAt', label: 'Registration Date' },
	{ value: 'student.firstName', label: 'Student Name' },
	{ value: 'level', label: 'Level' },
	{ value: 'semester', label: 'Semester' },
] as const;

export const SORT_ORDER_OPTIONS = [
	{ value: 'ASC', label: 'Ascending' },
	{ value: 'DESC', label: 'Descending' },
] as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export const LEVEL_OPTIONS = [
	{ value: '', label: 'All Levels' },
	{ value: '100', label: 'Level 100' },
	{ value: '200', label: 'Level 200' },
	{ value: '300', label: 'Level 300' },
	{ value: '400', label: 'Level 400' },
	{ value: '500', label: 'Level 500' },
] as const;

export const SEMESTER_OPTIONS = [
	{ value: '', label: 'All Semesters' },
	{ value: '1', label: 'Semester 1' },
	{ value: '2', label: 'Semester 2' },
] as const;
