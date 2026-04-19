'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { CustomPDFViewerProps } from './interface';
import { RenderParameters } from 'pdfjs-dist/types/src/display/api';

// Set worker source - using CDN for better performance
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.5.207/build/pdf.worker.min.mjs`;

const CustomPDFViewer = ({
	url,
	onPageChange,
	onProgress,
}: CustomPDFViewerProps) => {
	const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [scale, setScale] = useState(1.5);

	// refs
	const renderedPagesRef = useRef<Set<number>>(new Set());
	const renderingPagesRef = useRef<Set<number>>(new Set());
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
	const renderTasksRef = useRef<Map<number, any>>(new Map());
	const observerRef = useRef<IntersectionObserver | null>(null);
	const pdfRef = useRef<PDFDocumentProxy | null>(null);
	const currentPageRef = useRef(currentPage);
	const totalPagesRef = useRef(totalPages);

	// Update refs when state changes
	useEffect(() => {
		currentPageRef.current = currentPage;
	}, [currentPage]);

	useEffect(() => {
		totalPagesRef.current = totalPages;
	}, [totalPages]);

	useEffect(() => {
		pdfRef.current = pdf;
	}, [pdf]);

	// Load PDF document
	useEffect(() => {
		const renderTasksRefCopy = renderTasksRef.current;
		const loadPDF = async () => {
			try {
				setLoading(true);

				// Fetch PDF with credentials
				const response = await fetch(url, {
					credentials: 'omit',
					headers: {
						Cookie: document.cookie,
					},
				});

				if (!response.ok) {
					throw new Error(`Failed to load PDF: ${response.status}`);
				}

				const arrayBuffer = await response.arrayBuffer();
				const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer })
					.promise;

				setPdf(pdfDocument);
				setTotalPages(pdfDocument.numPages);
				setLoading(false);

				// Report initial progress
				onProgress?.(1, pdfDocument.numPages);
			} catch (error) {
				console.error('Error loading PDF:', error);
				setLoading(false);
			}
		};

		loadPDF();

		return () => {
			// Cleanup render tasks
			renderTasksRefCopy.forEach((task) => {
				if (task) task.cancel();
			});
			renderTasksRefCopy.clear();

			// Disconnect observer
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [url, onProgress]);

	// Render a specific page
	const renderPage = useCallback(
		async (pageNumber: number) => {
			const currentPdf = pdfRef.current;
			if (!currentPdf) return;

			// Check if already rendered or currently rendering
			if (
				renderedPagesRef.current.has(pageNumber) ||
				renderingPagesRef.current.has(pageNumber)
			) {
				return;
			}

			const canvas = canvasRefs.current.get(pageNumber);
			if (!canvas) return;

			try {
				// Mark as rendering
				renderingPagesRef.current.add(pageNumber);

				const page: PDFPageProxy = await currentPdf.getPage(pageNumber);
				const viewport = page.getViewport({ scale });

				const context = canvas.getContext('2d') ?? undefined;
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				const existingTask = renderTasksRef.current.get(pageNumber);
				if (existingTask) {
					await existingTask.cancel();
				}

				const renderContext: RenderParameters = {
					canvasContext: context,
					viewport: viewport,
					canvas: null,
				};

				const renderTask = page.render(renderContext);
				renderTasksRef.current.set(pageNumber, renderTask);

				await renderTask.promise;

				// Mark as rendered
				renderedPagesRef.current.add(pageNumber);
				renderTasksRef.current.delete(pageNumber);
			} catch (error: any) {
				if (error?.name !== 'RenderingCancelledException') {
					console.error(`Error rendering page ${pageNumber}:`, error);
				}
				renderTasksRef.current.delete(pageNumber);
			} finally {
				renderingPagesRef.current.delete(pageNumber);
			}
		},
		[scale],
	); // Only depends on scale

	// Create canvas elements for pages
	const createPageElements = useCallback(() => {
		if (!containerRef.current || !pdfRef.current) return;

		containerRef.current.innerHTML = '';
		canvasRefs.current.clear();

		for (let i = 1; i <= totalPagesRef.current; i++) {
			const pageContainer = document.createElement('div');
			pageContainer.className = 'pdf-page-container';
			pageContainer.setAttribute('data-page-number', i.toString());

			const canvas = document.createElement('canvas');
			canvas.className = 'pdf-page-canvas';
			canvas.setAttribute('data-page-number', i.toString());

			pageContainer.appendChild(canvas);
			containerRef.current.appendChild(pageContainer);
			canvasRefs.current.set(i, canvas);
		}

		// Render first few pages immediately
		const initialPages = Math.min(3, totalPagesRef.current);
		for (let i = 1; i <= initialPages; i++) {
			renderPage(i);
		}
	}, [renderPage]);

	// Setup intersection observer for lazy loading
	useEffect(() => {
		if (!containerRef.current || !pdfRef.current || totalPages === 0) return;

		createPageElements();

		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const pageNumber = parseInt(
							entry.target.getAttribute('data-page-number') || '0',
						);
						if (pageNumber > 0) {
							renderPage(pageNumber);
						}
					}
				});
			},
			{
				root: containerRef.current,
				rootMargin: '200px',
				threshold: 0.1,
			},
		);

		const pageContainers = containerRef.current.querySelectorAll(
			'.pdf-page-container',
		);
		pageContainers.forEach((container) => {
			observerRef.current?.observe(container);
		});

		return () => {
			observerRef.current?.disconnect();
		};
	}, [totalPages, createPageElements, renderPage]); // Only run when totalPages changes

	// Track current page on scroll
	useEffect(() => {
		const handleScroll = () => {
			if (!containerRef.current) return;

			const containers = containerRef.current.querySelectorAll(
				'.pdf-page-container',
			);
			let visiblePage = currentPageRef.current;
			let maxVisibleArea = 0;

			containers.forEach((container) => {
				const rect = container.getBoundingClientRect();
				const containerRect = containerRef.current!.getBoundingClientRect();

				const visibleTop = Math.max(rect.top, containerRect.top);
				const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
				const visibleHeight = Math.max(0, visibleBottom - visibleTop);
				const totalHeight = rect.height;
				const visibleRatio = visibleHeight / totalHeight;

				if (visibleRatio > maxVisibleArea) {
					maxVisibleArea = visibleRatio;
					visiblePage = parseInt(
						container.getAttribute('data-page-number') || '1',
					);
				}
			});

			if (visiblePage !== currentPageRef.current) {
				setCurrentPage(visiblePage);
				onPageChange?.(visiblePage, totalPagesRef.current);
				onProgress?.(visiblePage, totalPagesRef.current);

				// Preload adjacent pages
				for (let i = visiblePage - 2; i <= visiblePage + 2; i++) {
					if (
						i >= 1 &&
						i <= totalPagesRef.current &&
						!renderedPagesRef.current.has(i)
					) {
						renderPage(i);
					}
				}
			}
		};

		const container = containerRef.current;
		if (container && totalPages > 0) {
			container.addEventListener('scroll', handleScroll);
			setTimeout(handleScroll, 100);

			return () => {
				container.removeEventListener('scroll', handleScroll);
			};
		}
	}, [totalPages, onPageChange, onProgress, renderPage]); // Removed currentPage and renderedPages

	// Handle scale changes - re-render visible pages
	useEffect(() => {
		if (!pdfRef.current || totalPages === 0) return;

		// Clear rendered pages set
		renderedPagesRef.current.clear();

		// Re-render visible pages
		const visiblePage = currentPageRef.current;
		const startPage = Math.max(1, visiblePage - 2);
		const endPage = Math.min(totalPages, visiblePage + 2);

		for (let i = startPage; i <= endPage; i++) {
			renderPage(i);
		}
	}, [scale, totalPages, renderPage]);

	// Download/Print Prevention
	useEffect(() => {
		// Block keyboard shortcuts
		const preventShortcuts = (e: KeyboardEvent) => {
			// Block Ctrl+S / Cmd+S (Save)
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault();
				e.stopPropagation();
				console.log('Download blocked');
				return false;
			}

			// Block Ctrl+P / Cmd+P (Print)
			if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
				e.preventDefault();
				e.stopPropagation();
				console.log('Print blocked');
				return false;
			}

			// Block Ctrl+Shift+I (DevTools)
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
				e.preventDefault();
				return false;
			}

			// Block F12 (DevTools)
			if (e.key === 'F12') {
				e.preventDefault();
				return false;
			}

			// Block Ctrl+U (View Source)
			if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
				e.preventDefault();
				return false;
			}
		};

		// Block right-click context menu
		const preventContextMenu = (e: MouseEvent) => {
			// Allow right-click on UI controls but not on PDF canvas
			const target = e.target as HTMLElement;
			if (target.closest('.pdf-page-canvas')) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		};

		// Block drag and drop
		const preventDrag = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			return false;
		};

		// Block selection on canvas
		const preventSelection = (e: Event) => {
			const target = e.target as HTMLElement;
			if (target?.closest('.pdf-page-canvas')) {
				e.preventDefault();
			}
		};

		window.addEventListener('keydown', preventShortcuts);
		window.addEventListener('contextmenu', preventContextMenu);
		window.addEventListener('dragstart', preventDrag);
		window.addEventListener('selectstart', preventSelection);

		return () => {
			window.removeEventListener('keydown', preventShortcuts);
			window.removeEventListener('contextmenu', preventContextMenu);
			window.removeEventListener('dragstart', preventDrag);
			window.removeEventListener('selectstart', preventSelection);
		};
	}, []);

	// Zoom controls
	const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
	const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
	const resetZoom = () => setScale(1.5);

	// Navigation controls
	const goToPage = (page: number) => {
		const newPage = Math.max(1, Math.min(page, totalPages));
		setCurrentPage(newPage);

		// Scroll to page
		const pageContainer = containerRef.current?.querySelector(
			`.pdf-page-container[data-page-number="${newPage}"]`,
		);
		if (pageContainer) {
			pageContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading PDF...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="pdf-viewer-container">
			{/* Controls Bar */}
			<div className="pdf-controls sticky top-0 bg-white border-b border-gray-200 p-4 z-10 shadow-sm">
				<div className="flex items-center justify-between max-w-6xl mx-auto">
					<div className="flex items-center space-x-4">
						{/* Navigation */}
						<button
							onClick={() => goToPage(currentPage - 1)}
							disabled={currentPage === 1}
							className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
						>
							Previous
						</button>

						<span className="text-sm">
							Page
							<input
								type="number"
								value={currentPage}
								onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
								min={1}
								max={totalPages}
								className="w-16 mx-2 px-2 py-1 border rounded text-center"
							/>
							of {totalPages}
						</span>

						<button
							onClick={() => goToPage(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
						>
							Next
						</button>
					</div>

					<div className="flex items-center space-x-4">
						{/* Zoom Controls */}
						<button
							onClick={zoomOut}
							className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
							title="Zoom Out"
						>
							-
						</button>
						<span className="text-sm">{Math.round(scale * 100)}%</span>
						<button
							onClick={zoomIn}
							className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
							title="Zoom In"
						>
							+
						</button>
						<button
							onClick={resetZoom}
							className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
						>
							Reset
						</button>
					</div>

					{/* Progress Indicator */}
					<div className="text-sm text-gray-600">
						Progress: {Math.round((currentPage / totalPages) * 100)}%
					</div>
				</div>
			</div>

			{/* PDF Pages Container */}
			<div
				ref={containerRef}
				className="pdf-pages-container overflow-y-auto h-[calc(100vh-80px)] bg-gray-100"
				style={{ maxHeight: 'calc(100vh - 80px)' }}
			>
				{/* Pages will dynamically be added here */}
			</div>

			<style jsx>{`
				.pdf-page-container {
					margin: 20px auto;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
					background: white;
					width: fit-content;
				}

				.pdf-page-canvas {
					display: block;
					margin: 0 auto;
					user-select: none;
					pointer-events: none;
				}

				.pdf-controls button:active {
					transform: scale(0.98);
				}

				input[type='number']::-webkit-inner-spin-button,
				input[type='number']::-webkit-outer-spin-button {
					opacity: 1;
				}
			`}</style>
		</div>
	);
};

export default CustomPDFViewer;
