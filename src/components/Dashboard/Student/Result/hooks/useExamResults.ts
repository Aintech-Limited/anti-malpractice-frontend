"use client";

import { useState, useEffect, useCallback } from "react";
import {
  IExamResult,
  IMetaData,
  IStaffFilters,
  IStudentFilters,
  IUseExamResultsProps,
} from "../interface";
import { UserRoleTypeEnum } from "@/src/lib/enums";

export function useExamResults({
  role,
  initialFilters,
  initialPage = 1,
  initialLimit = 20,
}: IUseExamResultsProps) {
  const [data, setData] = useState<IExamResult[]>([]);
  const [meta, setMeta] = useState<IMetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IStaffFilters | IStudentFilters>(
    initialFilters ||
      (role === UserRoleTypeEnum.USER ? { courseCode: "" } : {}),
  );
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (role === UserRoleTypeEnum.USER) {
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
        role === UserRoleTypeEnum.USER
          ? `/api/v1/exam-results?${queryParams.toString()}`
          : `/api/v1/exam-results/staffs?${queryParams.toString()}`;

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setMeta(result.meta);
      } else {
        setError(result.message || "Failed to fetch results");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [role, filters, page, limit]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const downloadResults = async (format: "PDF" | "CSV") => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("format", format);
      queryParams.append("role", role);

      if (role === UserRoleTypeEnum.USER) {
        const studentFilters = filters as IStudentFilters;
        if (studentFilters.courseCode)
          queryParams.append("courseCode", studentFilters.courseCode);
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
      }

      const response = await fetch(
        `/api/v1/exam-results/download?${queryParams.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `exam-results.${format.toLowerCase()}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    }
  };

  return {
    data,
    meta,
    loading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    fetchResults,
    downloadResults,
  };
}
