"use client";

import { TResultStatusEnum } from "@/src/lib/enums";
import { examResultUtils } from "../../utils/utils";
import { IAdvancedFiltersPanelProps } from "./interface";
import { X } from "lucide-react";

export const AdvancedFiltersPanel = ({
  departments,
  setLocalFilters,
  localFilters,
  exams,
  handleApplyFilters,
  handleClearFilters,
}: IAdvancedFiltersPanelProps) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            value={localFilters.departmentId || ""}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                departmentId: e.target.value || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam
          </label>
          <select
            value={localFilters.examId || ""}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                examId: e.target.value || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Exams</option>
            {exams?.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={localFilters.status || ""}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                status: (e.target.value as TResultStatusEnum) || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            {examResultUtils.statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <div className="flex gap-2">
            <select
              value={localFilters.sortBy || "submittedAt"}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  sortBy: e.target.value as "submittedAt" | "createdAt",
                })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {examResultUtils.sortByOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={localFilters.sortOrder || "DESC"}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  sortOrder: e.target.value as "ASC" | "DESC",
                })
              }
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
        >
          <X size={16} />
          Clear All
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
