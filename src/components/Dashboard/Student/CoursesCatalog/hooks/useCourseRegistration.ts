import { useState } from "react";
import { Course } from "../interface";
import { toast } from "react-toastify";

export const useCourseRegistration = () => {
  const [registeredCourseIds, setRegisteredCourseIds] = useState<string[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterCOurseModal, setShowRegisterCourseModal] =
    useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleCourseSelect = async (
    course: Course,
    action: "register" | "continue_learning" = "register",
  ) => {
    console.log("Selected course:", course);
    setSelectedCourse(course);
    if (action === "register") setShowRegisterCourseModal(true);
  };

  const handleRegister = async (course?: Course) => {
    if (!selectedCourse && !course) return;

    setShowRegisterCourseModal(false);

    setIsRegistering(true);
    toast.info("Registering course. Please wait");
    try {
      console.log("Registering for course:", selectedCourse);
      const response = await fetch("/api/v1/course-registration", {
        method: "POST",
        body: JSON.stringify({ courseId: selectedCourse?.id ?? course?.id }),
      });
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      setRegisteredCourseIds((prev) => [
        ...prev,
        selectedCourse?.id ?? course?.id ?? "",
      ]);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registeredCourseIds,
    isRegistering,
    showRegisterCOurseModal,
    selectedCourse,

    handleCourseSelect,
    handleRegister,
    setShowRegisterCourseModal,
  };
};
