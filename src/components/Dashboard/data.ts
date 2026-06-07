import {
	BookOpen,
	Edit,
	FileText,
	HelpCircle,
	HouseIcon,
	Settings,
	ReceiptTextIcon,
	TentIcon,
} from 'lucide-react';
import { INavGroup } from './DashboardSidebar/SidebarItem/interface';

export const StudentNavGroups: INavGroup[] = [
	{ name: 'Dashboard', icon: HouseIcon, path: '', children: [] },
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
		name: 'Results',
		icon: ReceiptTextIcon,
		path: '/exam-results',
		children: [],
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
	{ name: 'Departments', icon: TentIcon, path: '/departments', children: [] },
	{ name: 'Profile', icon: Settings, path: '/profile', children: [] },
	// { name: 'Support', icon: HelpCircle, path: '/support', children: [] },
];
export const LecturerNavGroups: INavGroup[] = [
	{ name: 'Dashboard', icon: HouseIcon, path: '', children: [] },
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
			// { name: 'Registered Exams', path: '/registered' },
			{ name: 'Exams', path: '' },
		],
	},
	{
		name: 'Results',
		icon: ReceiptTextIcon,
		path: '/exam-results',
		children: [],
	},
	{
		name: 'Finance',
		icon: FileText,
		path: '/finance',
		children: [{ name: 'Payment History', path: '/history' }],
	},
	{ name: 'Departments', icon: TentIcon, path: '/departments', children: [] },
	{ name: 'Profile', icon: Settings, path: '/profile', children: [] },
	// { name: 'Support', icon: HelpCircle, path: '/support', children: [] },
	{ name: 'Accounts', icon: HelpCircle, path: '/accounts', children: [] },
];
export const AdminNavGroups: INavGroup[] = [
	{ name: 'Dashboard', icon: HouseIcon, path: '', children: [] },
	{ name: 'Departments', icon: TentIcon, path: '/departments', children: [] },
	{ name: 'Lecturers', icon: Settings, path: '/lecturers', children: [] },

	{
		name: 'Exams',
		icon: Edit,
		path: '/exams',
		// children: [{ name: 'Exams', path: '' }],
		children: [],
	},
	{
		name: 'Results',
		icon: ReceiptTextIcon,
		path: '/exam-results',
		children: [],
	},
	{ name: 'Profile', icon: Settings, path: '/profile', children: [] },
];
