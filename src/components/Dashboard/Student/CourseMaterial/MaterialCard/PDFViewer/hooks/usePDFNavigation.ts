import { useState, useEffect, useRef } from "react";
import { IUsePDFNavigationProps } from "./interface";

export const usePDFNavigation = ({
  totalPages,
  containerRef,
  renderedPagesRef,
  renderPage,
  onPageChange,
  onProgress,
}: IUsePDFNavigationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("1");
  const isProgrammaticScrolling = useRef(false);

  const currentPageRef = useRef(currentPage);

  useEffect(() => {
    const current = () => {
      currentPageRef.current = currentPage;
      setInputPage(currentPage.toString());
    };
    current();
  }, [currentPage]);

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
    setInputPage(newPage.toString());

    const pageContainer = containerRef.current?.querySelector(
      `.pdf-page-container[data-page-number="${newPage}"]`,
    );

    if (pageContainer) {
      isProgrammaticScrolling.current = true; // Engages lock
      pageContainer.scrollIntoView({ behavior: "smooth", block: "start" });

      // Releases lock cleanly post-transition completion
      setTimeout(() => {
        isProgrammaticScrolling.current = false;
      }, 750);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || totalPages === 0) return;

    const handleScroll = () => {
      if (isProgrammaticScrolling.current) return; // Aborts calculation when lock is engaged

      const containers = container.querySelectorAll(".pdf-page-container");
      let visiblePage = currentPageRef.current;
      let maxVisibleArea = 0;
      const containerRect = container.getBoundingClientRect();

      containers.forEach((pageCont) => {
        const rect = pageCont.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, containerRect.top);
        const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibleRatio = visibleHeight / rect.height;

        if (visibleRatio > maxVisibleArea) {
          maxVisibleArea = visibleRatio;
          visiblePage = parseInt(
            pageCont.getAttribute("data-page-number") || "1",
            10,
          );
        }
      });

      // console.log(
      // 	'visible page',
      // 	visiblePage,
      // 	'current',
      // 	currentPageRef.current,
      // );

      if (visiblePage !== currentPageRef.current && visiblePage > 0) {
        setCurrentPage(visiblePage);
        onPageChange?.(visiblePage, totalPages);
        onProgress?.(visiblePage, totalPages);

        // Buffer adjacent background renders
        for (let i = visiblePage - 2; i <= visiblePage + 2; i++) {
          if (i >= 1 && i <= totalPages && !renderedPagesRef.current?.has(i)) {
            renderPage(i);
          }
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [
    totalPages,
    renderPage,
    onPageChange,
    onProgress,
    containerRef,
    renderedPagesRef,
  ]);

  return { currentPage, inputPage, setInputPage, goToPage };
};
