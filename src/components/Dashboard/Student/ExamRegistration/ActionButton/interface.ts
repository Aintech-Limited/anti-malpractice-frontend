import { IExam } from '../interface';

export interface IActionButtonProps {
	exam: IExam;
	onRegister: (exam: IExam) => void;
	onRegisterLoading?: boolean;
	onPay: (exam: IExam) => void;
	onPayLoading?: boolean;
}
