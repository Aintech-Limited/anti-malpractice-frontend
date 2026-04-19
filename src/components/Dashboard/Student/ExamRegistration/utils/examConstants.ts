export const EXAM_STATUS = {
	UPCOMING: {
		label: 'Upcoming',
		color: 'bg-blue-100 text-blue-800',
		badgeColor: 'bg-blue-500',
	},
	STARTED: {
		label: 'Started',
		color: 'bg-yellow-100 text-yellow-800',
		badgeColor: 'bg-yellow-500',
	},
	ENDED: {
		label: 'Ended',
		color: 'bg-gray-100 text-gray-800',
		badgeColor: 'bg-gray-500',
	},
} as const;

export const YEAR_LEVELS = ['100', '200', '300', '400', '500'] as const;

export const SORT_OPTIONS = [
	{ value: 'createdAt', label: 'Created Date' },
	{ value: 'date', label: 'Exam Date' },
	{ value: 'fee', label: 'Fee' },
] as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export const LEGEND_ITEMS = [
	{
		label: 'Register Only',
		color: 'bg-blue-700',
		description: 'Register now, pay later',
	},
	{
		label: 'Pay & Register',
		color: 'bg-[#EAB308]',
		description: 'Pay and register immediately',
	},
	{
		label: 'Closed',
		color: 'bg-[#EF4444]',
		description: 'Registration closed',
	},
	{
		label: 'Registered',
		color: 'bg-green-600',
		description: 'Successfully registered',
	},
	{
		label: 'Continue Payment',
		color: 'bg-purple-600',
		description: 'Registered but not Paid',
	},
] as const;
