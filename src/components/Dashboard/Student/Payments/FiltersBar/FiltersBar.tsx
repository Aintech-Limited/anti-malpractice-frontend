import { Filter } from "lucide-react";
import { SORT_OPTIONS, PAGE_SIZE_OPTIONS } from "../utils/paymentConstants";
import { IFiltersBarProps } from "./interface";

export const FiltersBar = ({
  filters,
  showFilters,
  hasActiveFilters,
  onToggleFilters,
  onUpdateFilters,
  onClearFilters,
}: IFiltersBarProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="ml-2 w-2 h-2 bg-indigo-600 rounded-full"></span>
          )}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onUpdateFilters({ type: "EXAM_REGISTRATION" })}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filters.type === "EXAM_REGISTRATION"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Exams
          </button>
          <button
            onClick={() => onUpdateFilters({ type: "COURSE_MATERIAL" })}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filters.type === "COURSE_MATERIAL"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Materials
          </button>
          <button
            onClick={onClearFilters}
            className="px-3 py-1 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 bg-gray-50 border-t border-gray-100 animate-slideDown">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => onUpdateFilters({ sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items Per Page
              </label>
              <select
                value={filters.limit}
                onChange={(e) =>
                  onUpdateFilters({ limit: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
