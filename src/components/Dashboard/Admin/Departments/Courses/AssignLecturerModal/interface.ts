import { IAssignLecturerData } from '../interface';

export interface IAssignLecturerModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (data: IAssignLecturerData) => Promise<void>;
	courseId: string;
	departmentId: string;
	existingMainLecturer?: boolean;
}
