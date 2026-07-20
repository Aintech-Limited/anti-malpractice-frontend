import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { IDepartmentItemProps } from "./interface";
import { CourseItem } from "../CourseItem/CourseItem";

export const DepartmentItem = ({
  department,
  isExpanded,
  expandedCourses,
  getCourseStatus,
  isRegistering = false,
  onToggleDepartment,
  onToggleCourseDetails,
  onCourseSelect,
  onRegister,
}: IDepartmentItemProps) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggleDepartment}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {department.name}
          </h2>
          <span className="text-sm text-gray-500">
            ({department.courses.length} courses)
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="divide-y divide-gray-200">
          {department.courses.map((course) => (
            <CourseItem
              key={course.id}
              course={{ ...course, isRegistered: false }}
              status={getCourseStatus({ ...course, isRegistered: false })}
              isExpanded={expandedCourses.has(course.id)}
              isRegistering={isRegistering}
              onToggleDetails={() => onToggleCourseDetails(course.id)}
              onCourseSelect={onCourseSelect}
              onRegister={onRegister}
            />
          ))}
        </div>
      )}
    </div>
  );
};
