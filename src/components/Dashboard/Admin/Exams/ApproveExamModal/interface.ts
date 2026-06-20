import { IAdminExam } from '../interface';

export interface IAdminApproveExamModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (examId: string, notes?: string) => Promise<void>;
	exam: IAdminExam | null;
}
