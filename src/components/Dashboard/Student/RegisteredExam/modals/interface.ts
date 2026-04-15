import { IExamRegistration } from '../interface';

export interface IPaymentModalProps {
	exam: IExamRegistration;
	onClose: () => void;
	onSuccess: () => void;
}
