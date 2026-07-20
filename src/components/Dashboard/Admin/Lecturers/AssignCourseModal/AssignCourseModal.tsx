"use client";

import { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";
import { IAssignCourseModalProps } from "./interface";
import { roleOptions } from "../constants/constants";
import {
  AssignedLecturerStatusEnum,
  TLecturerROleEnumValue,
} from "@/src/lib/enums";
import { ILecturerCourse } from "../interface";
import { toast } from "react-toastify";

export default function AssignCourseModal({
  isOpen,
  onClose,
  onConfirm,
  lecturerId,
  lecturerName,
  departmentId,
}: IAssignCourseModalProps) {
  const [courses, setCourses] = useState<ILecturerCourse[]>([]);
  const [formData, setFormData] = useState({
    courseId: "",
    role: "ASSISTING_LECTURER" as TLecturerROleEnumValue,
    status: AssignedLecturerStatusEnum.ACTIVE,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen, departmentId]);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", "50");
      if (departmentId) params.append("departmentId", departmentId);

      const response = await fetch(
        `/api/v1/admin/courses?${params.toString()}`,
      );
      const data = await response.json();
      console.log("courses to assign: ", data);
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  if (!isOpen) return null;

  const selectedRole = roleOptions.find((r) => r.value === formData.role);
  const selectedCourse = courses.find((c) => c.id === formData.courseId);

  const handleSubmit = async () => {
    if (!formData.courseId) {
      toast.info("Please select a course");
      return;
    }

    setIsLoading(true);
    await onConfirm({
      lecturerId,
      ...formData,
    });
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-md bg-black/50" />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-linear-to-r from-purple-600 to-purple-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Assign Course</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Assigning to:</p>
            <p className="font-semibold text-gray-900">{lecturerName}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Course *
              </label>
              <select
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({ ...formData, courseId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loadingCourses}
              >
                <option value="">Choose a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseCode} - {course.title} (
                    {course.department.name})
                  </option>
                ))}
              </select>
            </div>

            {selectedCourse && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-blue-800">
                  📚 {selectedCourse.courseCode} | {selectedCourse.creditHours}{" "}
                  Credits | Level {selectedCourse.level} | Semester{" "}
                  {selectedCourse.semester}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
              {selectedRole && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedRole.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={AssignedLecturerStatusEnum.ACTIVE}>
                  {AssignedLecturerStatusEnum.ACTIVE}
                </option>

                {/* {statusOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))} */}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                placeholder="Additional notes about this assignment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.courseId}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            {isLoading ? "Assigning..." : "Assign Course"}
          </button>
        </div>
      </div>
    </div>
  );
}
