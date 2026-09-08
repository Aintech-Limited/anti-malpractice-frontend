import { useState } from "react";
import { Course } from "../interface";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/src/redux/reduxStore";
import {
  hideLoading,
  showLoading,
} from "@/src/redux/features/globalLoadingSlice/globalLoadingSlice";

export const useCourseRegistration = () => {
  const dispatch = useAppDispatch();

  const [registeredCourseIds, setRegisteredCourseIds] = useState<string[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterCOurseModal, setShowRegisterCourseModal] =
    useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleCourseSelect = async (
    course: Course,
    action: "register" | "continue_learning" = "register",
  ) => {
    setSelectedCourse(course);
    if (action === "register") setShowRegisterCourseModal(true);
  };

  const handleRegister = async (course?: Course) => {
    if (!selectedCourse && !course) return;

    setShowRegisterCourseModal(false);

    setIsRegistering(true);
    dispatch(showLoading("Registering course..."));
    try {
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
      dispatch(hideLoading());
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
