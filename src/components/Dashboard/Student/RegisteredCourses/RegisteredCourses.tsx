"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, TrendingUp, Bookmark, AlertCircle } from "lucide-react";
import { RegisteredCourse, RegisteredCoursesClientProps } from "./interface";
import AvailableCourseMaterialsModal from "../AvailableCourseMaterialsModal/AvailableCourseMaterialsModal";
import { toast } from "react-toastify";
import DropCOurseModal from "./DropCOurseModal/DropCOurseModal";
import COursesGrid from "./COursesGrid/COursesGrid";

export default function RegisteredCourses({
  courses: courseI,
  meta: metaI,
  error,
}: RegisteredCoursesClientProps) {
  const router = useRouter();
  const [courses, setCourses] = useState(courseI);
  const [meta, setMeta] = useState(metaI);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"progress" | "lastAccessed" | "title">(
    "lastAccessed",
  );
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    code: string;
    title: string;
  } | null>(null);
  const [modalStage, setModalStage] = useState<
    "drop_course" | "view_materials" | ""
  >("");
  const [dropCourseId, setDropCourseId] = useState<string | null>(null);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = new Set(courses.map((course) => course.department));
    return ["all", ...Array.from(depts)];
  }, [courses]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.courseTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (course) => course.department === selectedDepartment,
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return (b.progress ?? 0) - (a.progress ?? 0);
        case "lastAccessed":
          if (!b.lastAccessed || !a.lastAccessed) return 0;
          return (
            new Date(b.lastAccessed).getTime() -
            new Date(a.lastAccessed).getTime()
          );
        case "title":
          return a.courseTitle.localeCompare(b.courseTitle);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchQuery, selectedDepartment, sortBy]);

  const handleDropCOurse = (course: RegisteredCourse) => {
    setDropCourseId(course.id);
    setModalStage("drop_course");
  };

  const handleViewMaterials = (course: RegisteredCourse) => {
    setSelectedCourse({
      id: course.courseId,
      code: course.courseCode,
      title: course.courseTitle,
    });
    setModalStage("view_materials");
  };

  const handlePurchaseComplete = () => {
    // TODO: Refresh the course list to update any progress or status
    console.log("Purchase completed, refreshing data...");
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Courses
        </h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Registered Courses
        </h3>
        <p className="text-gray-600 mb-6">
          You haven&apos;t registered for any courses yet. Browse the course
          catalog to get started.
        </p>
        <button
          onClick={() => router.push("/catalog")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">
                {meta.totalItems}
              </p>
            </div>
            <BookOpen className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pages</p>
              <p className="text-3xl font-bold text-gray-900">
                {meta.totalPages}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search courses by title or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="lastAccessed">Recently Accessed</option>
            <option value="progress">Progress</option>
            <option value="title">Course Title</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => {
          console.log(course);
          return (
            <COursesGrid
              key={course.id}
              course={course}
              expandedCourseId={expandedCourseId}
              handleDropCOurse={handleDropCOurse}
              handleViewMaterials={handleViewMaterials}
              setExpandedCourseId={setExpandedCourseId}
            />
          );
        })}
      </div>
      {/* Materials Modal */}
      {selectedCourse && (
        <AvailableCourseMaterialsModal
          isOpen={modalStage === "view_materials"}
          onClose={() => {
            setModalStage("");
            setSelectedCourse(null);
          }}
          courseId={selectedCourse.id}
          courseCode={selectedCourse.code}
          courseTitle={selectedCourse.title}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}

      {/* Empty State for Filtered Results */}
      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No courses match your filters
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
      {modalStage === "drop_course" && dropCourseId && (
        <DropCOurseModal
          close={() => {
            setModalStage("");
            setDropCourseId(null);
          }}
          registeredCourseId={dropCourseId}
          onSuccess={() => {
            setCourses((prev) => prev.filter((c) => c.id !== dropCourseId));
            toast.success("Course Dropped successfully!");
          }}
        />
      )}
    </div>
  );
}
