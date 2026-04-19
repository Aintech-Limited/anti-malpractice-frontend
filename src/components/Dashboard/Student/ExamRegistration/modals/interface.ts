import { IExam } from '../interface';

export interface IRegistrationFormProps {
	exam: IExam;
	onSubmit: (level: number, semester: number, payNow: boolean) => Promise<void>;
	isLoading: boolean;
}
