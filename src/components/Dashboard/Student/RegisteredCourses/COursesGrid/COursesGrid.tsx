"use client";

import Image from "next/image";
import { ICOursesGridProps } from "./interface";
import { Calendar, Clock, Star } from "lucide-react";
import ExpandedCourse from "./ExpandedCourse/ExpandedCourse";

const COursesGrid = ({
  course,
  handleDropCOurse,
  handleViewMaterials,
  expandedCourseId,
  setExpandedCourseId,
}: ICOursesGridProps) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600 bg-green-100";
    if (progress >= 50) return "text-blue-600 bg-blue-100";
    if (progress >= 20) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 80) return "bg-green-600";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 20) return "bg-yellow-600";
    return "bg-gray-600";
  };

  const formatLastAccessed = (date: string) => {
    const lastAccessed = new Date(date);
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60),
    );

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    return lastAccessed.toLocaleDateString();
  };
  return (
    <div
      key={course.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Course Card Content */}
      <div className="p-6">
        <div className="flex gap-4">
          {/* Course Cover */}
          {course.MaterialCover && (
            <div className="w-24 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={course.MaterialCover}
                alt={course.courseTitle}
                width={96}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Course Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {course.courseCode ?? "N/A"}: {course.courseTitle}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {course.department ?? "N/A"} • Level {course.level ?? "N/A"} •{" "}
                  {course.courseCredits ?? "N/A"} Credits
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Lecturer: {course?.lecturer?.firstName ?? "N/A"}{" "}
                  {course?.lecturer?.lastName ?? ""}
                </p>
              </div>

              {course.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-600">{course.rating}</span>
                </div>
              )}
            </div>

            {/* Progress Section */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span className={getProgressColor(course?.progress ?? 0)}>
                  {course.progress ?? 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${getProgressBarColor(course?.progress ?? 0)} rounded-full h-2 transition-all duration-300`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  Last accessed:{" "}
                  {course?.lastAccessed
                    ? formatLastAccessed(course.lastAccessed)
                    : 0}
                </span>
              </div>
              {course.nextClass && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Next: {course.nextClass.day} at {course.nextClass.time}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              {
                <button
                  onClick={() => handleDropCOurse(course)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Drop Course?
                </button>
              }

              <button
                onClick={() =>
                  setExpandedCourseId(
                    expandedCourseId === course.courseId
                      ? null
                      : course.courseId,
                  )
                }
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                {expandedCourseId === course.courseId
                  ? "Less Details"
                  : "More Details"}
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {expandedCourseId === course.courseId && (
          <ExpandedCourse
            course={course}
            handleViewMaterials={handleViewMaterials}
          />
        )}
      </div>
    </div>
  );
};

export default COursesGrid;
