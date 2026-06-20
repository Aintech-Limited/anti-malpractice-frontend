import { IAdminExam } from '../interface';

export interface IAdminExamCardProps {
	exam: IAdminExam;
	onViewDetails: (exam: IAdminExam) => void;
	onApprove: (exam: IAdminExam) => void;
	onRequestChanges: (exam: IAdminExam) => void;
}
