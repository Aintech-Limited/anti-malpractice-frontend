"use client";

import { formatDate } from "@/src/lib/helper";
import { IResultsTableProps } from "./interface";
import { examResultUtils } from "../../utils/utils";

export const ResultsTable = ({ results }: IResultsTableProps) => {
  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
            >
              Student
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
            >
              Course
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
            >
              Exam
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
            >
              Score
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
            >
              Grade
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
            >
              Passed
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
            >
              Submitted
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {results.map((result, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
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
                  <span className="text-green-600 font-semibold">✓ Yes</span>
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
  );
};
