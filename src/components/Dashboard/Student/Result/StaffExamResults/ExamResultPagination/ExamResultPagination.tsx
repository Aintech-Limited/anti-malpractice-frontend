"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { IExamResultPaginationProps } from "./interface";

export const ExamResultPagination = ({
  meta,
  setPage,
}: IExamResultPaginationProps) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-500">
        Showing {(meta.page - 1) * meta.limit + 1} to{" "}
        {Math.min(meta.page * meta.limit, meta.totalItems)} of {meta.totalItems}{" "}
        results
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!meta.hasPreviousPage}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="px-4 py-2 text-sm font-medium text-gray-700">
          Page {meta.page} of {meta.totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!meta.hasNextPage}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
