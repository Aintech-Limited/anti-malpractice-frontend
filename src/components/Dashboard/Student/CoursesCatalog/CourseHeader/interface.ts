import { ICourse, TCourseStatus } from '../interface';

export interface ICourseHeaderProps {
	course: ICourse;
	status: TCourseStatus;
	isExpanded: boolean;
	isRegistering?: boolean;
	onToggleDetails: () => void;
	onCourseSelect: (course: ICourse) => void;
	onRegister: (course: ICourse) => void;
}
