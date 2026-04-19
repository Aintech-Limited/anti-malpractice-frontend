import { IExam } from '../interface';

export interface IExamCardProps {
	exam: IExam;
	onViewQuestions: (exam: IExam) => void;
	onAddQuestions: (exam: IExam) => void;
	onUpdate: (exam: IExam) => void;
	onDelete: (exam: IExam) => void;
	onViewRegistrations: (exam: IExam) => void;
}
