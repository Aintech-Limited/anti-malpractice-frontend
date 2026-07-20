"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IExamFilters } from "../interface";

export const useExamFilters = (initialFilters: IExamFilters) => {
  const router = useRouter();
  const [filters, setFilters] = useState<IExamFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const updateFilters = (newFilters: Partial<IExamFilters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);

    const params = new URLSearchParams();
    params.set("page", updated.page.toString());
    params.set("limit", updated.limit.toString());
    if (updated.status) params.set("status", updated.status);
    if (updated.type_) params.set("type_", updated.type_);
    if (updated.sortBy) params.set("sortBy", updated.sortBy);
    if (updated.sortOrder) params.set("sortOrder", updated.sortOrder);
    if (typeof updated.published === "boolean")
      params.set("sortOrder", updated.sortOrder);

    router.push(`/dashboard/lecturer/exams?${params.toString()}`);
  };

  const fetchPage = async (page: number): Promise<any> => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", filters.limit.toString());
    params.set("published", "true");
    if (filters.status) params.set("status", filters.status);
    if (filters.type_) params.set("type_", filters.type_);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (typeof filters.published === "boolean")
      params.set("sortOrder", filters.sortOrder);

    const response = await fetch(`/api/v1/exams?${params}`);
    return response.json();
  };

  const clearFilters = () => {
    updateFilters({
      status: "",
      type_: "",
      sortBy: "createdAt",
      sortOrder: "DESC",
      page: 1,
      published: undefined,
    });
  };

  const hasActiveFilters = filters.status !== "" || filters.type_ !== "";

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
