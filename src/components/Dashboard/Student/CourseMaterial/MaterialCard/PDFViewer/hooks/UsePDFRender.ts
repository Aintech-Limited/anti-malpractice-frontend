import { useEffect, useRef, useCallback } from 'react';
import { PDFPageProxy } from 'pdfjs-dist';
import { RenderParameters } from 'pdfjs-dist/types/src/display/api';
import { IUsePDFRenderProps } from './interface';

export const usePDFRender = ({
	pdf,
	totalPages,
	scale,
	containerRef,
	renderTasksRef,
}: IUsePDFRenderProps) => {
	const renderedPagesRef = useRef<Set<number>>(new Set());
	const renderingPagesRef = useRef<Set<number>>(new Set());
	const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
	const observerRef = useRef<IntersectionObserver | null>(null);

	// useEffect(() => {
	// 	console.log('PDF CHANGED');
	// }, [pdf]);

	useEffect(() => {
		console.log('CLEARING RENDERED PAGES');
		renderedPagesRef.current.clear();
		renderingPagesRef.current.clear();
		canvasRefs.current.clear();

		renderTasksRef.current?.forEach((task) => task.cancel());
		renderTasksRef.current?.clear();
	}, [pdf]);

	const renderPage = useCallback(
		async (pageNumber: number) => {
			// console.log('rendering page', pageNumber);
			if (!pdf) return;

			if (
				renderedPagesRef.current.has(pageNumber) ||
				renderingPagesRef.current.has(pageNumber)
			) {
				return;
			}

			const canvas = canvasRefs.current.get(pageNumber);
			if (!canvas) return;

			try {
				renderingPagesRef.current.add(pageNumber);

				const page: PDFPageProxy = await pdf.getPage(pageNumber);
				const viewport = page.getViewport({ scale });
				const context = canvas.getContext('2d');

				canvas.height = viewport.height;
				canvas.width = viewport.width;

				// Fixes ghosting: Wipe out old pixels before drawing a new scale size
				if (context) {
					context.clearRect(0, 0, canvas.width, canvas.height);
				}

				const existingTask = renderTasksRef.current?.get(pageNumber);
				if (existingTask) {
					await existingTask.cancel();
				}

				const renderContext: RenderParameters = {
					canvasContext: context ?? undefined,
					viewport,
					canvas: null,
				};

				const renderTask = page.render(renderContext);
				renderTasksRef.current?.set(pageNumber, renderTask);

				await renderTask.promise;

				renderedPagesRef.current.add(pageNumber);
				renderTasksRef.current?.delete(pageNumber);
			} catch (error: any) {
				if (error?.name !== 'RenderingCancelledException') {
					console.error(`Error rendering page ${pageNumber}:`, error);
				}
				renderTasksRef.current?.delete(pageNumber);
			} finally {
				renderingPagesRef.current.delete(pageNumber);
			}
		},
		[pdf, scale, renderTasksRef],
	);

	const createPageElements = useCallback(() => {
		if (!containerRef.current || !pdf) return;

		containerRef.current.innerHTML = '';
		canvasRefs.current.clear();

		for (let i = 1; i <= totalPages; i++) {
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

		// Direct paint initialization for initial view window
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const initialPages = Math.min(3, totalPages);

				for (let i = 1; i <= initialPages; i++) {
					renderPage(i);
				}
			});
		});
	}, [pdf, totalPages, renderPage, containerRef]);

	// Observer registration setup
	useEffect(() => {
		if (!containerRef.current || !pdf || totalPages === 0) return;

		createPageElements();

		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const pageNumber = parseInt(
							entry.target.getAttribute('data-page-number') || '0',
							10,
						);
						// console.log('OBSERVED', pageNumber, entry.isIntersecting);
						if (pageNumber > 0) {
							renderPage(pageNumber);
							// console.log('RENDER COMPLETE', pageNumber);
						}
					}
				});
			},
			{ root: containerRef.current, rootMargin: '200px', threshold: 0.01 },
		);

		const pageContainers = containerRef.current.querySelectorAll(
			'.pdf-page-container',
		);
		pageContainers.forEach((container) =>
			observerRef.current?.observe(container),
		);

		return () => observerRef.current?.disconnect();
	}, [totalPages, createPageElements, renderPage, containerRef, pdf]);

	// Handle zooming events
	useEffect(() => {
		if (!pdf || totalPages === 0) return;
		// console.log('ZOOM EFFECT', { scale, totalPages, hasPdf: !!pdf });
		renderedPagesRef.current.clear();
	}, [scale, totalPages, pdf]);

	return { renderPage, renderedPagesRef };
};
