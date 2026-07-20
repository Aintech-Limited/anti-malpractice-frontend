"use client";

import { useState } from "react";
import { IAssignedCourse } from "../interface";

export const useAssignedCourses = (initialCourses: IAssignedCourse[]) => {
  const [courses, setCourses] = useState<IAssignedCourse[]>(initialCourses);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "/api/v1/course-assignments/staff?page=1&limit=50&sortBy=assignedAt&sortOrder=asc",
      );
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseById = (courseId: string) => {
    return courses.find((c) => c.id === courseId);
  };

  return {
    courses,
    loading,
    fetchCourses,
    getCourseById,
  };
};
