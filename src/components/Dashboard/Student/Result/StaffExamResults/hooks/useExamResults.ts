"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ExamResultsResponse,
  IExamResult,
  IMetaData,
  IStaffExamResultsProps,
  IStaffFilters,
  IStudentFilters,
  IUseExamResultsProps,
} from "../../interface";
import { UserRoleTypeEnum } from "@/src/lib/enums";
import { exportExamResults } from "@/src/lib/utils/exportExamResults";
import { useAuth } from "@/src/providers/auth/AuthContext";

export function useExamResults({
  role,
  initialFilters,
  initialPage = 1,
  initialLimit = 20,
}: IUseExamResultsProps) {
  const { user } = useAuth();

  const [exams, setExams] = useState<IStaffExamResultsProps["exams"]>([]);
  const [departments, setDepartments] = useState<
    IStaffExamResultsProps["departments"]
  >([]);
  const [data, setData] = useState<IExamResult[]>([]);
  const [meta, setMeta] = useState<IMetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    network: string;
    download: string;
    search: string;
  }>({ download: "", network: "", search: "" });
  const [filters, setFilters] = useState<IStaffFilters | IStudentFilters>(
    initialFilters ||
      (role === UserRoleTypeEnum.STUDENT ? { courseCode: "" } : {}),
  );
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(() => ({ download: "", search: "", network: "" }));

    try {
      const queryParams = new URLSearchParams();

      if (role === UserRoleTypeEnum.STUDENT) {
        const studentFilters = filters as IStudentFilters;
        if (studentFilters.courseCode) {
          queryParams.append("courseCode", studentFilters.courseCode);
        }
      } else {
        const staffFilters = filters as IStaffFilters;
        if (staffFilters.courseCode)
          queryParams.append("courseCode", staffFilters.courseCode);
        if (staffFilters.studentId)
          queryParams.append("studentId", staffFilters.studentId);
        if (staffFilters.departmentId)
          queryParams.append("departmentId", staffFilters.departmentId);
        if (staffFilters.examId)
          queryParams.append("examId", staffFilters.examId);
        if (staffFilters.status)
          queryParams.append("status", staffFilters.status);
        if (staffFilters.sortBy)
          queryParams.append("sortBy", staffFilters.sortBy);
        if (staffFilters.sortOrder)
          queryParams.append("sortOrder", staffFilters.sortOrder);
      }

      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      const endpoint =
        role === UserRoleTypeEnum.STUDENT
          ? `/api/v1/exam-results?${queryParams.toString()}`
          : `/api/v1/exam-results/staffs?${queryParams.toString()}`;

      const response = await fetch(endpoint);
      const result = (await response.json()) as ExamResultsResponse;

      if (result.success) {
        setData(
          role === UserRoleTypeEnum.STUDENT
            ? result.data.map((data) => ({
                ...data,
                user: {
                  id: user?.id ?? "",
                  firstName: user?.firstName ?? "",
                  lastName: user?.lastName ?? "",
                },
              }))
            : result.data,
        );
        setMeta(result.meta);
      } else {
        setError((prev) => ({
          ...prev,
          network: result.message || "Failed to fetch results",
        }));
      }
    } catch (err) {
      setError((prevErrors) => ({
        ...prevErrors,
        network: err instanceof Error ? err.message : "An error occurred",
      }));
    } finally {
      setLoading(false);
    }
  }, [role, page, limit, filters, user?.id, user?.firstName, user?.lastName]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    if (UserRoleTypeEnum.STUDENT === role) return;
    const getExamsAndDepartments = async () => {
      try {
        const deptResponse = await fetch(
          `/api/v1/departments?limit=50&page=1&sortOrder=DESC&sortBy=createdAt`,
          {
            method: "GET",
          },
        );

        const deptData = (await deptResponse.json()) as {
          message: string;
          success: boolean;
          data: { id: string; name: string; [key: string]: any }[];
        };

        if (deptData?.success) {
          setDepartments(
            deptData.data.map((dept) => ({
              id: dept.id,
              name: dept.name,
            })),
          );
        }
        const examsResponse = await fetch(
          `/api/v1/exams?limit=50&page=1&sortOrder=DESC&sortBy=createdAt`,
          {
            method: "GET",
          },
        );

        const examsData = (await examsResponse.json()) as {
          message: string;
          success: boolean;
          data: { id: string; title: string; [key: string]: any }[];
        };

        if (examsData?.success) {
          setExams(
            examsData.data.map((exam) => ({
              id: exam.id,
              title: exam.title,
            })),
          );
        }
      } catch (error) {
        //
      }
    };

    getExamsAndDepartments();
  }, [role]);

  const downloadResults = async (format: "PDF" | "CSV") => {
    setError((prevErrors) => ({ ...prevErrors, download: "" }));
    try {
      exportExamResults(data, format);
    } catch (err) {
      setError((prevErrors) => ({
        ...prevErrors,
        download: err instanceof Error ? err.message : "Download failed",
      }));
    }
  };

  return {
    data,
    meta,
    loading,
    error,
    filters,
    exams,
    departments,
    setFilters,
    page,
    setPage,
    fetchResults,
    downloadResults,
    setError,
  };
}
