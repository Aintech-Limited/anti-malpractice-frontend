"use client";

import {
  AdminExamReviewStatus,
  AdminExamTypeEnum,
  TAdminExamStatusValue,
  TAdminExamTypeEnumValue,
} from "@/src/lib/enums";
import { IExamFiltersProps } from "./interface";
import { ClosedCaptionIcon } from "lucide-react";

const ExamFilters = ({
  onShowFIlters,
  filters,
  onSetFIlters,
  departments,
  courses,
  onClearFilters,
  onApplyFilters,
}: IExamFiltersProps) => {
  const REVIEW_STATUS = Object.values(AdminExamReviewStatus);
  const EXAM_TYPES = Object.values(AdminExamTypeEnum);

  return (
    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Filter Exams</h3>
        <button
          onClick={() => onShowFIlters(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <ClosedCaptionIcon size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select
            value={filters.adminStatus || ""}
            onChange={(e) =>
              onSetFIlters({
                ...filters,
                adminStatus:
                  (e.target.value as TAdminExamStatusValue) || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            {REVIEW_STATUS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Exam Type</label>
          <select
            value={filters.type_ || ""}
            onChange={(e) =>
              onSetFIlters({
                ...filters,
                type_: (e.target.value as TAdminExamTypeEnumValue) || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            {EXAM_TYPES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Department</label>
          <select
            value={filters.departmentId || ""}
            onChange={(e) => {
              onSetFIlters({
                ...filters,
                departmentId: e.target.value || undefined,
                courseId: undefined,
              });
            }}
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
          <label className="block text-sm text-gray-600 mb-1">Course</label>
          <select
            value={filters.courseId || ""}
            onChange={(e) =>
              onSetFIlters({
                ...filters,
                courseId: e.target.value || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!filters.departmentId}
          >
            <option value="">All Courses</option>
            {courses
              .filter(
                (c) =>
                  !filters.departmentId ||
                  c.department.id === filters.departmentId,
              )
              .map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseCode} - {course.title}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Published</label>
          <select
            value={
              filters.published === undefined ? "" : String(filters.published)
            }
            onChange={(e) => {
              const value = e.target.value;
              onSetFIlters({
                ...filters,
                published: value === "" ? undefined : value === "true",
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Start Date From
          </label>
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) =>
              onSetFIlters({
                ...filters,
                startDate: e.target.value || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          Clear All
        </button>
        <button
          onClick={() =>
            onApplyFilters({
              adminStatus: filters.adminStatus,
              type_: filters.type_,
              departmentId: filters.departmentId,
              courseId: filters.courseId,
              published: filters.published,
              startDate: filters.startDate,
            })
          }
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ExamFilters;
