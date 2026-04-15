import { RegisteredCourse } from '../interface';

export interface ICOursesGridProps {
	course: RegisteredCourse;
	handleDropCOurse: (course: RegisteredCourse) => void;
	handleViewMaterials: (course: RegisteredCourse) => void;
	expandedCourseId: string | null;
	setExpandedCourseId: (id: string | null) => void;
}
