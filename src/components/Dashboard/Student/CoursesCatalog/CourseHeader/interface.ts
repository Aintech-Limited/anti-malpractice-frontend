import { ICourse, TCourseStatus } from '../interface';

export interface ICourseHeaderProps {
	course: ICourse;
	status: TCourseStatus;
	isExpanded: boolean;
	isRegistering?: boolean;
	onToggleDetails: () => void;
	onCourseSelect: (
		course: ICourse,
		action: 'register' | 'continue_learning',
	) => void;
	onRegister: (course: ICourse) => void;
}
