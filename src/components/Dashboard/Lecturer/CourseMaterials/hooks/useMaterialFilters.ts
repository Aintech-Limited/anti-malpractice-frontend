"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IMaterialFilters } from "../interface";

export const useMaterialFilters = (initialFilters: IMaterialFilters) => {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const updateFilters = (newFilters: Partial<IMaterialFilters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);

    const params = new URLSearchParams();
    params.set("page", updated.page.toString());
    params.set("limit", updated.limit.toString());
    if (updated.sortBy) params.set("sortBy", updated.sortBy);
    if (updated.sortOrder) params.set("sortOrder", updated.sortOrder);
    if (updated.fileType) params.set("fileType", updated.fileType);
    if (updated.isFree) params.set("isFree", updated.isFree);
    if (updated.search) params.set("search", updated.search);

    router.push(`/dashboard/lecturers/courses/materials?${params.toString()}`);
  };

  const fetchPage = async (page: number): Promise<any> => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", filters.limit.toString());
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters.fileType) params.set("fileType", filters.fileType);
    if (filters.isFree) params.set("isFree", filters.isFree);
    if (filters.search) params.set("search", filters.search);

    const response = await fetch(`/api/v1/course-materials?${params}`);
    return await response.json();
  };

  const clearFilters = () => {
    updateFilters({
      fileType: "",
      isFree: "",
      search: "",
      sortBy: "createdAt",
      sortOrder: "DESC",
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.fileType !== "" || filters.isFree !== "" || filters.search !== "";

  return {
    filters,
    showFilters,
    hasActiveFilters,
    setShowFilters,
    updateFilters,
    fetchPage,
    clearFilters,
  };
};
