"use client";

import { useState, useRef } from "react";
import { useLoadPDF } from "./hooks/useLoadPDF";
import { usePDFNavigation } from "./hooks/usePDFNavigation";
import { IPDFViewerProps } from "./interface";
import usePreventShortcuts from "./hooks/usePreventShortcuts";
import { usePDFRender } from "./hooks/UsePDFRender";

const PDFViewer = ({ url, onPageChange, onProgress }: IPDFViewerProps) => {
  const [scale, setScale] = useState(1.5);
  const containerRef = useRef<HTMLDivElement>(null);

  // Document Loader
  const { pdf, totalPages, loading, renderTasksRef } = useLoadPDF(
    url,
    onProgress,
  );

  // Layout & Pixel Renderer
  const { renderPage, renderedPagesRef } = usePDFRender({
    pdf,
    totalPages,
    scale,
    containerRef,
    renderTasksRef,
  });

  // Locking Navigation State Controller
  const { currentPage, inputPage, setInputPage, goToPage } = usePDFNavigation({
    totalPages,
    containerRef,
    renderedPagesRef,
    renderPage,
    onPageChange,
    onProgress,
  });

  usePreventShortcuts();

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));

  if (loading) return <div>Loading PDF Asset...</div>;

  return (
    <div className="pdf-viewer-container">
      <div className="pdf-controls sticky top-0 bg-white border-b border-gray-200 p-4 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
            >
              Prev
            </button>

            <span className="text-sm">
              <input
                type="number"
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && goToPage(parseInt(inputPage, 10) || 1)
                }
                onBlur={() => setInputPage(currentPage.toString())}
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
              onClick={() => setScale(2)}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="pdf-pages-container overflow-y-auto h-[calc(100vh-80px)] bg-gray-100"
        style={{ maxHeight: "calc(100vh - 80px)" }}
      />
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

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default PDFViewer;
