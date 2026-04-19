import {
	BookOpen,
	Edit,
	FileText,
	HelpCircle,
	HouseIcon,
	Settings,
} from 'lucide-react';
import { INavGroup } from './DashboardSidebar/SidebarItem/interface';

export const StudentNavGroups: INavGroup[] = [
	{
		name: 'Courses',
		icon: BookOpen,
		path: '/courses',
		children: [
			{ name: 'Registered Courses', path: '/registered' },
			{ name: 'Course Materials', path: '/materials' },
			{ name: 'Course Catalog', path: '/catalog' },
		],
	},
	{
		name: 'Exams',
		icon: Edit,
		path: '/exams',
		children: [
			// { name: 'Available Exams', path: '/available' },
			{ name: 'Exam Registration', path: '/registration' }, // list of exams to register from
			{ name: 'Registered Exams', path: '/registered' }, // list of registered exams
			{ name: 'Exam Results', path: '/results' },
		],
	},
	{
		name: 'Finance',
		icon: FileText,
		path: '/finance',
		children: [
			{ name: 'Payment History', path: '/history' },
			// { name: 'Pending Invoices', path: '/invoices' },
		],
	},
	{ name: 'Departments', icon: HouseIcon, path: '/departments', children: [] },
	{ name: 'Profile', icon: Settings, path: '/profile', children: [] },
	// { name: 'Support', icon: HelpCircle, path: '/support', children: [] },
];
export const LecturerNavGroups: INavGroup[] = [
	{
		name: 'Courses',
		icon: BookOpen,
		path: '/courses',
		children: [
			{ name: 'Course Materials', path: '/materials' },
			{ name: 'Course Catalog', path: '/catalog' },
		],
	},
	{
		name: 'Exams',
		icon: Edit,
		path: '/exams',
		children: [
			{ name: 'Registered Exams', path: '/registered' },
			{ name: 'Exams', path: '' },
		],
	},
	{
		name: 'Finance',
		icon: FileText,
		path: '/finance',
		children: [{ name: 'Payment History', path: '/history' }],
	},
	{ name: 'Departments', icon: HouseIcon, path: '/departments', children: [] },
	{ name: 'Profile', icon: Settings, path: '/profile', children: [] },
	// { name: 'Support', icon: HelpCircle, path: '/support', children: [] },
	{ name: 'Accounts', icon: HelpCircle, path: '/accounts', children: [] },
];
