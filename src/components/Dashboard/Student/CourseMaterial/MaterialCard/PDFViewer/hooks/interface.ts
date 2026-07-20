import { PDFDocumentProxy } from "pdfjs-dist";

export interface IUsePDFNavigationProps {
  totalPages: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  renderedPagesRef: React.RefObject<Set<number>>;
  renderPage: (pageNumber: number) => Promise<void>;
  onPageChange?: (currentPage: number, totalPages: number) => void;
  onProgress?: (currentPage: number, totalPages: number) => void;
}

export interface IUsePDFRenderProps {
  pdf: PDFDocumentProxy | null;
  totalPages: number;
  scale: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  renderTasksRef: React.RefObject<Map<number, any>>;
}
