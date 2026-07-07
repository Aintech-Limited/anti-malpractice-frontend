import { IMeta } from '../../Department/interface';

export interface IStudent {
	id: string;
	firstName: string;
	lastName: string;
	level?: string;
	email: string;
	year?: string;
	imageURL?: string;
	suspended: boolean;
	suspendedBy: { firstName: string; lastName: string | null } | null;
}

export type TActionType = 'view' | 'suspend' | 'unsuspend' | null;

export interface IStudentManagenementProps {
	initialData: IStudentManagenementResponse;
}

export interface IStudentManagenementResponse {
	data: IStudent[];
	message: string;
	meta: IMeta;
	success: boolean;
}
