"use client";

import { useState } from "react";
import { Search, Download, FileText, FileSpreadsheet } from "lucide-react";
import { useExamResults } from "../StaffExamResults/hooks/useExamResults";
import { IStudentExamResultsProps } from "../interface";
import { UserRoleTypeEnum } from "@/src/lib/enums";
import { examResultUtils } from "../utils/utils";
import { formatDate } from "@/src/lib/helper";
import { ExamResultPagination } from "../StaffExamResults/ExamResultPagination/ExamResultPagination";

export default function StudentExamResults({
  initialPage = 1,
  initialLimit = 50,
}: IStudentExamResultsProps) {
  const [courseCodeInput, setCourseCodeInput] = useState("");
  const {
    data,
    meta,
    loading,
    error,
    filters,

    setFilters,
    setPage,
    downloadResults,
    setError,
  } = useExamResults({
    role: UserRoleTypeEnum.STUDENT,
    initialFilters: { courseCode: "" },
    initialPage,
    initialLimit,
  });

  const handleSearch = () => {
    if (courseCodeInput.trim()) {
      if (courseCodeInput.length < 3) {
        setError((prevErrors) => ({
          ...prevErrors,
          search: "Example MATH101, CS50",
        }));
        return;
      }
      setFilters({ courseCode: courseCodeInput.toUpperCase() });
      setPage(1);
    } else {
      setFilters({ courseCode: "" });
      setPage(1);
    }
  };

  const handleExport = async (format: "PDF" | "CSV") => {
    await downloadResults(format);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {error?.network && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-2">
          {error?.network}
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Exam Results</h1>
        <p className="text-gray-500 mt-1">
          View and download your exam results
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        {error?.search && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-2">
            {error?.search}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Code
            </label>
            <input
              type="text"
              value={courseCodeInput}
              onChange={(e) => {
                setError((prevErrors) => ({ ...prevErrors, search: "" }));
                setCourseCodeInput(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g., CS50, MATH101"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </div>
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
          {filters.courseCode && (
            <p className="text-sm text-gray-400 mt-1">
              Try searching with a different course code
            </p>
          )}
        </div>
      ) : (
        <>
          {error?.download && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-2">
              {error?.download}
            </div>
          )}
          <div className="flex justify-end gap-3 mb-4">
            <button
              onClick={() => handleExport("CSV")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <FileSpreadsheet size={16} />
              Export CSV
            </button>
            <button
              onClick={() => handleExport("PDF")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Course
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Exam Title
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
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
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
                        <span className="text-green-600 font-semibold">
                          ✓ Yes
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">✗ No</span>
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

          {meta && meta.totalPages > 1 && (
            <ExamResultPagination meta={meta} setPage={setPage} />
          )}
        </>
      )}
    </div>
  );
}
