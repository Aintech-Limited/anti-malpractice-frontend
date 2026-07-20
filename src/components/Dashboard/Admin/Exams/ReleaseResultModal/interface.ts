import { IAdminExam } from '../interface';

export interface IAdminReleaseResultModalProps {
	isOpen: boolean;
	onClose: () => void;
	exam: IAdminExam | null;
	onReleaseResult: (
		examId: string,
	) => Promise<{ message: string; success: boolean } | null>;
}
