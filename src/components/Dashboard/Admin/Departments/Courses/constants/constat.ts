export const statusColors = {
	ACTIVE: 'bg-green-100 text-green-800',
	ONGOING: 'bg-blue-100 text-blue-800',
	INACTIVE: 'bg-gray-100 text-gray-800',
	ENDED: 'bg-red-100 text-red-800',
};

export const roleColors = {
	MAIN_LECTURER: 'bg-red-100 text-red-800',
	ASSISTING_LECTURER: 'bg-blue-100 text-blue-800',
	GUEST_LECTURER: 'bg-green-100 text-green-800',
	TEACHING_ASSISTANT: 'bg-purple-100 text-purple-800',
};

export const assignedLecturerStatusColors = {
	ACTIVE: 'bg-green-100 text-green-800',
	INACTIVE: 'bg-gray-100 text-gray-800',
	PENDING: 'bg-yellow-100 text-yellow-800',
	COMPLETED: 'bg-blue-100 text-blue-800',
};

export const statusOptions = [
	{ value: 'ACTIVE', label: 'Active', color: 'green' },
	{ value: 'ONGOING', label: 'Ongoing', color: 'blue' },
	{ value: 'INACTIVE', label: 'Inactive', color: 'gray' },
	{ value: 'ENDED', label: 'Ended', color: 'red' },
];
export const roleOptions = [
	{
		value: 'MAIN_LECTURER',
		label: 'Main Lecturer',
		description: 'Primary responsible lecturer',
	},
	{
		value: 'ASSISTING_LECTURER',
		label: 'Assisting Lecturer',
		description: 'Supports main lecturer',
	},
	{
		value: 'GUEST_LECTURER',
		label: 'Guest Lecturer',
		description: 'For specific sessions',
	},
	{
		value: 'TEACHING_ASSISTANT',
		label: 'Teaching Assistant',
		description: 'Assists with grading and tutorials',
	},
];
