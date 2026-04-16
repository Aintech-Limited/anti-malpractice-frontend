import { IDepartmentStats } from '../interface';

export const SORT_OPTIONS = [
	{ value: 'createdAt', label: 'Recently Added' },
	{ value: 'name', label: 'Department Name' },
] as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50] as const;

export const VIEW_MODES = {
	GRID: 'grid',
	LIST: 'list',
} as const;

export const DEFAULT_STATS: IDepartmentStats = {
	students: 0,
	faculty: 0,
	courses: 0,
	researchGroups: 0,
	established: 'N/A',
	location: 'Not specified',
	email: 'Not available',
	phone: 'Not available',
	vision: 'Information not available',
	mission: 'Information not available',
	achievements: ['Information not available'],
};
