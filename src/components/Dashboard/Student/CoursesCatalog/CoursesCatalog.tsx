"use client";

import { useEffect, useRef, useState } from "react";
import { ICourseCatalogProps } from "./interface";
import { useCourseCatalog } from "./hooks/useCourseCatalog";
import { useCourseRegistration } from "./hooks/useCourseRegistration";
import { SearchAndFilterBar } from "./SearchAndFilterBar/SearchAndFilterBar";
import { DepartmentList } from "./DepartmentList/DepartmentList";
import { Legend } from "./Legend/Legend";
import { CourseRegistrationModal } from "./modals/CourseRegistrationModal";

const CourseCatalog = ({
  departments,
  activeSemester = 1,
}: ICourseCatalogProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [contentMinHeight, setContentMinHeight] = useState(
    "calc(100vh - 320px)",
  );

  const {
    registeredCourseIds,
    isRegistering,
    handleCourseSelect,
    handleRegister,
    setShowRegisterCourseModal,
    showRegisterCOurseModal,
    selectedCourse,
  } = useCourseRegistration();

  const {
    expandedDepartments,
    selectedLevel,
    searchQuery,
    expandedCourses,
    filteredDepartments,
    getCourseStatus,
    setSelectedLevel,
    setSearchQuery,
    toggleDepartment,
    toggleCourseDetails,
  } = useCourseCatalog(departments, activeSemester, registeredCourseIds);

  useEffect(() => {
    const calculateHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const minHeight = viewportHeight - headerHeight - 32; // 32px for padding
        setContentMinHeight(`${minHeight}px`);
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);

    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-10">
      <div
        ref={headerRef}
        className="sticky top-0 bg-linear-to-br z-10 pb-10 bg-white"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Course Catalog
          </h1>
        </div>

        <SearchAndFilterBar
          searchQuery={searchQuery}
          selectedLevel={selectedLevel}
          onSearchChange={setSearchQuery}
          onLevelChange={setSelectedLevel}
        />

        <Legend />
      </div>

      <div style={{ minHeight: contentMinHeight }}>
        <DepartmentList
          departments={filteredDepartments}
          expandedDepartments={expandedDepartments}
          expandedCourses={expandedCourses}
          getCourseStatus={getCourseStatus}
          isRegistering={isRegistering}
          onToggleDepartment={toggleDepartment}
          onToggleCourseDetails={toggleCourseDetails}
          onCourseSelect={handleCourseSelect}
          onRegister={handleRegister}
          onClearFilters={() => setSearchQuery("")}
        />
      </div>

      <CourseRegistrationModal
        courseTitle={selectedCourse?.title ?? ""}
        onClose={() => setShowRegisterCourseModal(false)}
        onConfirm={handleRegister}
        isOpen={showRegisterCOurseModal}
      />
    </div>
  );
};

export default CourseCatalog;
