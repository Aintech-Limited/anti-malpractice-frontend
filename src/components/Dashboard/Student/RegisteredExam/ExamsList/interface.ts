import { IExamRegistration } from '../interface';

export interface IExamsListProps {
	exams: IExamRegistration[];
	onContinuePayment: (exam: IExamRegistration) => void;
}
