import { ICourse, IDepartment } from '../interface';

export interface IDepartmentItemProps {
	department: IDepartment;
	isExpanded: boolean;
	expandedCourses: Set<string>;
	getCourseStatus: (course: ICourse) => any;
	isRegistering?: boolean;
	onToggleDepartment: () => void;
	onToggleCourseDetails: (courseId: string) => void;
	onCourseSelect: (
		course: ICourse,
		action: 'register' | 'continue_learning',
	) => void;
	onRegister: (course: ICourse) => void;
}
