"use client";

import { useState } from "react";
import { IDepartment, IMeta } from "../interface";

export const useDepartments = (
  initialDepartments: IDepartment[],
  initialMeta: IMeta,
) => {
  const [departments, setDepartments] =
    useState<IDepartment[]>(initialDepartments);
  const [filteredDepartments, setFilteredDepartments] =
    useState<IDepartment[]>(initialDepartments);
  const [meta, setMeta] = useState<IMeta>(initialMeta);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("createdAt");
  const [showFilters, setShowFilters] = useState(false);

  const updateDepartments = (newDepartments: IDepartment[], newMeta: IMeta) => {
    setDepartments(newDepartments);
    setFilteredDepartments(newDepartments);
    setMeta(newMeta);
  };

  const updateFilteredDepartments = (filtered: IDepartment[]) => {
    setFilteredDepartments(filtered);
  };

  const setLoadingState = (isLoading: boolean) => setLoading(isLoading);
  const setIsSearchingState = (isSearching: boolean) =>
    setIsSearching(isSearching);
  const setSearchTermState = (term: string) => setSearchTerm(term);
  const setLocalSearchTermState = (term: string) => setLocalSearchTerm(term);
  const setViewModeState = (mode: "grid" | "list") => setViewMode(mode);
  const setSortByState = (sort: "name" | "createdAt") => setSortBy(sort);
  const setShowFiltersState = (show: boolean) => setShowFilters(show);
  const updateMetaLimit = (limit: number) =>
    setMeta((prev) => ({ ...prev, limit }));

  return {
    departments,
    filteredDepartments,
    meta,
    loading,
    searchTerm,
    localSearchTerm,
    isSearching,
    viewMode,
    sortBy,
    showFilters,
    updateDepartments,
    updateFilteredDepartments,
    setLoadingState,
    setIsSearchingState,
    setSearchTermState,
    setLocalSearchTermState,
    setViewModeState,
    setSortByState,
    setShowFiltersState,
    updateMetaLimit,
  };
};
