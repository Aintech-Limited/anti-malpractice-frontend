'use client';

import { useEffect } from 'react';

// Download/Print Prevention
const usePreventShortcuts = () => {
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
			const closes = (e.target as any)?.closest;
			if (!closes) return;
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
};

export default usePreventShortcuts;
