export interface IPDFViewerProps {
  url: string;
  onPageChange?: (pageNumber: number, totalPages: number) => void;
  onProgress?: (currentPage: number, totalPages: number) => void;
}

export interface IPageView {
  pageNumber: number;
  renderTask: any;
}
