export interface IStudentNavigationProps {
	currentPage: number;
	itemsPerPage: number;
	filteredData: any[];
	totalPages: number;
	handlePageChange: (newPage: number) => void;
	dataType: string;
}
