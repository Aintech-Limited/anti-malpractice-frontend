import { IAssignCourseData } from '../interface';

export interface IAssignCourseModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (data: IAssignCourseData) => Promise<void>;
	lecturerId: string;
	lecturerName: string;
	departmentId?: string;
}
