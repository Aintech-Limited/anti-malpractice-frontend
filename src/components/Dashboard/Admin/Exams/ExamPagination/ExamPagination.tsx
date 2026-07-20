"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { IExamPaginationProps } from "./interface";

const ExamPagination = ({
  currentPage,
  hasPreviousPage,
  limit,
  loading,
  hasNextPage,
  total,
  onPreviousPage,
  onNextPage,
}: IExamPaginationProps) => {
  return (
    <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-500">
        Showing {(currentPage - 1) * limit + 1} to{" "}
        {Math.min(currentPage * limit, total)} of {total} exams
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPreviousPage}
          disabled={!hasPreviousPage || loading}
          className="p-2 rounded-full border border-gray-300 disabled:opacity-30 hover:bg-white transition"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="font-medium text-gray-600 px-3">
          Page {currentPage} of {Math.ceil(total / limit)}
          {loading && (
            <span className="text-xs text-indigo-500 ml-2">(Loading...)</span>
          )}
        </span>

        <button
          onClick={onNextPage}
          disabled={!hasNextPage || loading}
          className="p-2 rounded-full border border-gray-300 hover:bg-white transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ExamPagination;
