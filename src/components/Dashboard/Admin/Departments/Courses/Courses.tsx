"use client";

import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Filter,
  X as CloseIcon,
  UserPlus,
} from "lucide-react";
import {
  IAdminDepartmentCoursesClientProps,
  IAssignLecturerData,
  ICourse,
  ICourseFilters,
  ICoursesResponse,
  ILecturerAssignment,
} from "./interface";
import { CourseStatusEnum, LecturerROleEnum } from "@/src/lib/enums";
import { statusColors } from "./constants/constat";
import AddCourseModal from "./AddCourseModal/AddCourseModal";
import EditCourseModal from "./EditCourseModal/EditCourseModal";
import DeleteCourseModal from "./DeleteCourseModal/DeleteCourseModal";
import AssignLecturerModal from "./AssignLecturerModal/AssignLecturerModal";
import ViewLecturersModal from "./ViewLecturersModal/ViewLecturersModal";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/src/providers/auth/AuthContext";

export default function CoursesClient({
  departmentId,
  initialData,
  initialPage,
  limit,
}: IAdminDepartmentCoursesClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<ICourse[]>(initialData.data);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setCurrentTotalPages] = useState(
    initialData.meta.totalPages,
  );
  const [hasNextPage, setHasNextPage] = useState(initialData.meta.hasNextPage);
  const [hasPreviousPage, setHasPreviousPage] = useState(
    initialData.meta.hasPreviousPage,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ICourseFilters>({
    page: initialPage,
    limit: limit,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [viewLecturersModalOpen, setViewLecturersModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [existingMainLecturer, setExistingMainLecturer] = useState(false);

  const loadCourses = async (page: number, currentFilters: ICourseFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (currentFilters.creditHours)
        params.append("creditHours", String(currentFilters.creditHours));
      if (currentFilters.semester)
        params.append("semester", String(currentFilters.semester));
      if (currentFilters.level)
        params.append("level", String(currentFilters.level));
      if (currentFilters.status) params.append("status", currentFilters.status);

      const response = await fetch(
        `/api/v1/admin/departments/${departmentId}/courses?${params.toString()}`,
        {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`);
      }

      const result: ICoursesResponse = await response.json();

      if (result.success) {
        setCourses(result.data);
        setCurrentPage(result.meta.page);
        setCurrentTotalPages(result.meta.totalPages);
        setHasNextPage(result.meta.hasNextPage);
        setHasPreviousPage(result.meta.hasPreviousPage);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && !loading) {
      const newPage = currentPage + 1;
      setFilters({ ...filters, page: newPage });
      loadCourses(newPage, { ...filters, page: newPage });
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage && !loading) {
      const newPage = currentPage - 1;
      setFilters({ ...filters, page: newPage });
      loadCourses(newPage, { ...filters, page: newPage });
    }
  };

  const handleApplyFilters = () => {
    setFilters({ ...filters, page: 1 });
    loadCourses(1, { ...filters, page: 1 });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { page: 1, limit: limit };
    setFilters(clearedFilters);
    loadCourses(1, clearedFilters);
    setShowFilters(false);
  };

  const handleCreateCourse = async (data: any) => {
    try {
      const response = await fetch("/api/v1/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await loadCourses(currentPage, filters);
        toast.success("Course created successfully!");
      } else {
        toast.error(`Failed to create course: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    }
  };

  const handleUpdateCourse = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/v1/admin/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await loadCourses(currentPage, filters);
        toast.success("Course updated successfully!");
      } else {
        toast.error(`Failed to update course: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course. Please try again.");
    }
  };

  const handleDeleteCourse = async (id: string, archive?: boolean) => {
    try {
      const response = await fetch(
        `/api/v1/admin/courses/${id}?archive=${archive}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (result.success) {
        await loadCourses(currentPage, filters);
        toast.success(
          archive
            ? "Course archived successfully!"
            : "Course deleted successfully!",
        );
      } else {
        toast.error(
          `Failed to ${archive ? "archive" : "delete"} course: ${result.message}`,
        );
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course. Please try again.");
    }
  };

  const handleAssignLecturer = async (data: IAssignLecturerData) => {
    try {
      const response = await fetch("/api/v1/admin/courses/assign-lecturer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Lecturer assigned successfully!");
      } else {
        toast.error(`Failed to assign lecturer: ${result.message}`);
      }
    } catch (error) {
      console.error("Error assigning lecturer:", error);
      toast.error("Failed to assign lecturer. Please try again.");
    }
  };

  const handleUnassignLecturer = async (assignmentId: string) => {
    try {
      const response = await fetch(
        `/api/v1/admin/courses/assign-lecturer?unassigned=true`,
        {
          method: "POST",
          body: JSON.stringify({ assignmentId, lecturerId: user!.id }),
        },
      );

      const result = await response.json();

      if (!result.success) {
        toast.error(`Failed to unassign lecturer: ${result.message}`);
      }
    } catch (error) {
      console.error("Error unassigning lecturer:", error);
      toast.error("Failed to unassign lecturer. Please try again.");
    }
  };

  const openAssignModal = async (course: ICourse) => {
    setSelectedCourse(course);
    // Check if main lecturer exists
    try {
      const response = await fetch(
        `/api/v1/admin/courses/${course.id}/lecturers`,
      );
      const data = await response.json();
      if (data.success) {
        const hasMainLecturer = data.data.some(
          (a: ILecturerAssignment) => a.role === LecturerROleEnum.MAIN_LECTURER,
        );
        setExistingMainLecturer(hasMainLecturer);
      }
    } catch (error) {
      console.error("Error checking main lecturer:", error);
    }
    setAssignModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <div className="text-sm text-gray-500">
            ({courses.length} courses)
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Course
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border rounded-lg transition ${showFilters ? "bg-blue-100 border-blue-300 text-blue-600" : "bg-white border-gray-200 text-gray-400"}`}
          >
            <Filter size={20} />
          </button>
          <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <CloseIcon size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Credit Hours
              </label>
              <input
                type="number"
                value={filters.creditHours || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    creditHours: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="Any"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Semester
              </label>
              <input
                type="number"
                value={filters.semester || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    semester: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="1 or 2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Level</label>
              <input
                type="number"
                value={filters.level || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    level: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="100, 200, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: (e.target.value as any) || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {Object.values(CourseStatusEnum).map((status) => {
                  return (
                    <option key={status} value={status}>
                      {status}{" "}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Clear
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* List Section */}
      <div className="space-y-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6"
          >
            {/* Icon */}
            <div className="w-full md:w-32 h-32 shrink-0">
              <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-blue-400" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-gray-900">
                    {course.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColors[course.status]}`}
                  >
                    {course.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-xs font-semibold">
                    {course.courseCode}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-semibold">
                    {course.creditHours} Credits
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-semibold">
                    Semester {course.semester}
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-xs font-semibold">
                    Level {course.level}
                  </span>
                </div>
              </div>

              {course.description && (
                <p className="text-gray-500 text-sm leading-relaxed">
                  {course.description}
                </p>
              )}

              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-gray-500">Prerequisites:</span>
                  {course.prerequisites.map((prereq) => (
                    <span
                      key={prereq}
                      className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                    >
                      {prereq}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-400">
                Created by{" "}
                {`${course.creator.firstName} ${course.creator.lastName}`} on{" "}
                {formatDate(course.createdAt)}
              </div>
            </div>

            {/* Actions */}
            <div className="md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setViewLecturersModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-100 transition flex items-center justify-center gap-2"
                >
                  <Users size={18} />
                  View Lecturers
                </button>

                <button
                  onClick={() => openAssignModal(course)}
                  className="w-full py-2.5 bg-purple-50 text-purple-600 font-semibold rounded-xl hover:bg-purple-100 transition flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} />
                  Assign Lecturer
                </button>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    router.push(
                      `/dashboard/admins/departments/${departmentId}/courses/${course.id}/students`,
                    );
                  }}
                  className="w-full py-2.5 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-100 transition flex items-center justify-center gap-2"
                >
                  <Users size={18} />
                  View registered Students
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setEditModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setDeleteModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No courses found in this department</p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            Create your first course →
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={handlePreviousPage}
          disabled={!hasPreviousPage || loading}
          className="p-2 rounded-full border border-gray-300 disabled:opacity-30 hover:bg-white transition"
        >
          <ChevronLeft />
        </button>

        <span className="font-medium text-gray-600">
          Page {currentPage}
          {`showing Page ${currentPage} of ${totalPages}`}
          {loading && (
            <span className="text-xs text-blue-500 ml-2">(Loading...)</span>
          )}
        </span>

        <button
          onClick={handleNextPage}
          disabled={!hasNextPage || loading}
          className="p-2 rounded-full border border-gray-300 hover:bg-white transition"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Modals */}
      <AddCourseModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={handleCreateCourse}
        departmentId={departmentId}
      />

      <EditCourseModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleUpdateCourse}
        course={selectedCourse}
      />

      <DeleteCourseModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleDeleteCourse}
        course={selectedCourse}
      />

      <AssignLecturerModal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleAssignLecturer}
        courseId={selectedCourse?.id || ""}
        departmentId={departmentId}
        existingMainLecturer={existingMainLecturer}
      />

      <ViewLecturersModal
        isOpen={viewLecturersModalOpen}
        onClose={() => {
          setViewLecturersModalOpen(false);
          setSelectedCourse(null);
        }}
        courseId={selectedCourse?.id || ""}
        onUnassign={handleUnassignLecturer}
        onReassign={(assignment) => {
          setViewLecturersModalOpen(false);
          // Open assign modal with pre-filled data
          setAssignModalOpen(true);
        }}
      />
    </div>
  );
}
