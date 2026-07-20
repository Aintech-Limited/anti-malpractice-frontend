import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist";

// Define explicit web worker mapping
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.5.207/build/pdf.worker.min.mjs`;

export const useLoadPDF = (
  url: string,
  onProgress?: (currentPage: number, totalPages: number) => void,
) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const renderTasksRef = useRef<Map<number, any>>(new Map());

  useEffect(() => {
    const activeTasks = renderTasksRef.current;

    const loadPDF = async () => {
      try {
        setLoading(true);

        const response = await fetch(url, {
          credentials: "omit",
          // headers: {
          // 	Cookie: document.cookie,
          // },
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

        onProgress?.(1, pdfDocument.numPages);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setLoading(false);
      }
    };

    loadPDF();

    return () => {
      // Clean up rendering tasks safely during unmounts or URL changes
      activeTasks.forEach((task) => {
        if (task) task.cancel();
      });
      activeTasks.clear();
    };
  }, [url]);

  return { pdf, totalPages, loading, renderTasksRef };
};
