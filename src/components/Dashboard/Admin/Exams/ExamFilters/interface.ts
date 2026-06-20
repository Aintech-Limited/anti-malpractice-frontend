import { SetStateAction } from 'react';
import {
	IAdminExamCourse,
	IAdminExamDepartment,
	IAdminExamFilters,
} from '../interface';

export interface IExamFiltersProps {
	onShowFIlters: (value: SetStateAction<boolean>) => void;
	filters: IAdminExamFilters;
	onSetFIlters: (value: SetStateAction<IAdminExamFilters>) => void;
	departments: IAdminExamDepartment[];
	courses: IAdminExamCourse[];
	onClearFilters: () => void;
	onApplyFilters: (newFilters: Partial<IAdminExamFilters>) => void;
}
