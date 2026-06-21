import { IStudent } from '../interface';
import { SetStateAction } from 'react';

export interface IStudentNavigationProps {
	currentPage: number;
	itemsPerPage: number;
	filteredStudents: IStudent[];
	totalPages: number;
	onSetCurrentPage: (value: SetStateAction<number>) => void;
}
