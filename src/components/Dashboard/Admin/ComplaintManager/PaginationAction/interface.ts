import { SetStateAction } from 'react';
import { IComplaintRecord } from '../interface';

export interface IPaginationActionProps {
	currentPage: number;
	itemsPerPage: number;
	filteredRecords: IComplaintRecord[];
	setCurrentPage: (value: SetStateAction<number>) => void;
	totalPages: number;
}
