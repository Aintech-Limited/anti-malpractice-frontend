import { IAdminExam } from '../interface';

export interface IAdminRequestChangesModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (examId: string, changes: string) => Promise<void>;
	exam: IAdminExam | null;
}
