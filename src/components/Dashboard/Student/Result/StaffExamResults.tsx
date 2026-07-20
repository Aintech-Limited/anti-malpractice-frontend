"use client";

import { useState } from "react";
import {
  Search,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { useExamResults } from "./hooks/useExamResults";
import { IStaffExamResultsProps, IStaffFilters } from "./interface";
import { TResultStatusEnum } from "@/src/lib/enums";
import { examResultUtils } from "./utils/utils";
import { formatDate } from "@/src/lib/helper";

export default function StaffExamResults({
  role,
  departments = [],
  exams = [],
  initialPage = 1,
  initialLimit = 50,
}: IStaffExamResultsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<IStaffFilters>({});

  const {
    data,
    meta,
    loading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    downloadResults,
  } = useExamResults({
    role,
    initialFilters: {},
    initialPage,
    initialLimit,
  });

  const handleApplyFilters = () => {
    setFilters(localFilters);
    setPage(1);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    setFilters({});
    setPage(1);
    setShowFilters(false);
  };

  const handleExport = async () => {
    await downloadResults("CSV");
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Exam Results Management
        </h1>
        <p className="text-gray-500 mt-1">
          View and manage student exam results
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-50">
            <input
              type="text"
              placeholder="Search by course code..."
              value={localFilters.courseCode || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, courseCode: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1 min-w-50">
            <input
              type="text"
              placeholder="Student ID (optional)"
              value={localFilters.studentId || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, studentId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <Filter size={18} />
            Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Search size={18} />
            Search
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
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
                  {departments.map((dept) => (
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
                  {exams.map((exam) => (
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
                      status:
                        (e.target.value as TResultStatusEnum) || undefined,
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
        )}
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-500">Loading results...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No exam results found</p>
        </div>
      ) : (
        <>
          {/* Export Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Student
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Course
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Exam
                  </th>
                  <th className="text-center px-6 py-3 text-sm font-semibold text-gray-700">
                    Score
                  </th>
                  <th className="text-center px-6 py-3 text-sm font-semibold text-gray-700">
                    Grade
                  </th>
                  <th className="text-center px-6 py-3 text-sm font-semibold text-gray-700">
                    Passed
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {result.user
                          ? `${result.user.firstName} ${result.user.lastName}`
                          : "N/A"}
                      </div>
                      {result.user?.email && (
                        <div className="text-xs text-gray-500">
                          {result.user.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {result.examAttempt.exam.course.courseCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {result.examAttempt.exam.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-medium">
                      {result.score}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${examResultUtils.getGradeColor(result.grade)}`}
                      >
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {result.examAttempt.passed ? (
                        <span className="text-green-600 font-semibold">✓</span>
                      ) : (
                        <span className="text-red-600 font-semibold">✗</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(result.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                {Math.min(meta.page * meta.limit, meta.totalItems)} of{" "}
                {meta.totalItems} results
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
          )}
        </>
      )}
    </div>
  );
}
