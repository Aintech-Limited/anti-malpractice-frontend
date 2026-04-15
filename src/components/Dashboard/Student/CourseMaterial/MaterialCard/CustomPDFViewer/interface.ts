export interface CustomPDFViewerProps {
	url: string;
	onPageChange?: (pageNumber: number, totalPages: number) => void;
	onProgress?: (currentPage: number, totalPages: number) => void;
}

export interface PageView {
	pageNumber: number;
	renderTask: any;
}
