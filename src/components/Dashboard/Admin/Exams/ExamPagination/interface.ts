export interface IExamPaginationProps {
	currentPage: number;
	limit: number;
	total: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
	loading: boolean;
	onPreviousPage: () => void;
	onNextPage: () => void;
}
