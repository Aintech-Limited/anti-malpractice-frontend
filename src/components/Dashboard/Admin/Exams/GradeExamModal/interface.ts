import { IAdminExam } from '../interface';

export interface IAdminGradeExamModalProps {
	isOpen: boolean;
	onClose: () => void;
	exam: IAdminExam | null;
	ongradeExam: (
		examId: string,
	) => Promise<{ message: string; success: boolean } | null>;
}
