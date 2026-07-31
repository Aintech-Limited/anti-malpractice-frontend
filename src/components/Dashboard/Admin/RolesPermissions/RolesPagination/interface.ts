import { IMeta } from '../interface';

export interface IPaginationProps {
	meta: IMeta;
	handlePageChange: (page: number) => void;
	currentPage: number;
}
