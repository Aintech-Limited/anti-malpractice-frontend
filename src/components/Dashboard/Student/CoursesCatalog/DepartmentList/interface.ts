import { ICourse, IDepartment } from '../interface';

export interface IDepartmentListProps {
	departments: IDepartment[];
	expandedDepartments: Set<string>;
	expandedCourses: Set<string>;
	getCourseStatus: (course: ICourse) => any;
	isRegistering?: boolean;
	onToggleDepartment: (deptId: string) => void;
	onToggleCourseDetails: (courseId: string) => void;
	onCourseSelect: (
		course: ICourse,
		action: 'register' | 'continue_learning',
	) => void;
	onRegister: (course: ICourse) => void;
	onClearFilters?: () => void;
}
