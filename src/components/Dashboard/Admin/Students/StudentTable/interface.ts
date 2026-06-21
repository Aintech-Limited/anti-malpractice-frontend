import { IStudent, TActionType } from '../interface';
import { SetStateAction } from 'react';

export interface IStudentTableProps {
	student: IStudent;
	activeDropdownId: string | null;
	onSetActiveDropdownId: (value: SetStateAction<string | null>) => void;
	onAction: (type: TActionType, student: IStudent) => void;
}
