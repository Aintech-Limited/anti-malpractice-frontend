"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/providers/auth/AuthContext";
import { IDepartment } from "../interface";

export const useDepartmentFilters = () => {
  const router = useRouter();
  const { user } = useAuth();

  const updateURL = (
    name: string,
    page: number,
    limit: number,
    sortBy: string,
  ) => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (page > 1) params.set("page", page.toString());
    if (limit !== 10) params.set("limit", limit.toString());
    if (sortBy !== "createdAt") params.set("sortBy", sortBy);

    const basePath = user?.role === "USER" ? "students" : "lecturers";
    router.push(`/dashboard/${basePath}/departments?${params.toString()}`);
  };

  const performLocalSearch = (
    departments: IDepartment[],
    searchTerm: string,
    updateFiltered: (filtered: IDepartment[]) => void,
    setSearchTerm: (term: string) => void,
    setIsSearching: (isSearching: boolean) => void,
    updateURLFn: (
      name: string,
      page: number,
      limit: number,
      sortBy: string,
    ) => void,
    limit: number,
    sortByValue: string,
  ) => {
    setIsSearching(true);

    const localResults = departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (localResults.length > 0 && searchTerm) {
      updateFiltered(localResults);
      setSearchTerm(searchTerm);
      setIsSearching(false);
      updateURLFn(searchTerm, 1, limit, sortByValue);
    } else if (searchTerm) {
      return false; // Need server search
    } else {
      updateFiltered(departments);
      setSearchTerm("");
      updateURLFn("", 1, limit, sortByValue);
      setIsSearching(false);
    }
    return true;
  };

  const handleSort = (
    sort: "name" | "createdAt",
    filteredDepartments: IDepartment[],
    setSortBy: (sort: "name" | "createdAt") => void,
    updateFiltered: (filtered: IDepartment[]) => void,
    fetchPageFn: (page: number) => void,
  ) => {
    setSortBy(sort);
    const sorted = [...filteredDepartments];
    if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    updateFiltered(sorted);
    fetchPageFn(1);
  };

  const clearSearch = (
    setLocalSearchTerm: (term: string) => void,
    setSearchTerm: (term: string) => void,
    updateFiltered: (filtered: IDepartment[]) => void,
    departments: IDepartment[],
    updateURLFn: (
      name: string,
      page: number,
      limit: number,
      sortBy: string,
    ) => void,
    limit: number,
    sortByValue: string,
  ) => {
    setLocalSearchTerm("");
    setSearchTerm("");
    updateFiltered(departments);
    updateURLFn("", 1, limit, sortByValue);
  };

  return {
    updateURL,
    performLocalSearch,
    handleSort,
    clearSearch,
  };
};
