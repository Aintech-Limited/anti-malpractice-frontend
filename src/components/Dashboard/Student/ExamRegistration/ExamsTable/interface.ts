import { IExam } from '../interface';

export interface IExamsTableProps {
	exams: IExam[];
	onRegister: (exam: IExam) => void;
	onRegisterLoading: boolean;
	onPay: (exam: IExam) => void;
	onPayLoading: boolean;
}
