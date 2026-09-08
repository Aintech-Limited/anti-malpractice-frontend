"use client";

import { useEffect, useState } from "react";
import { IDepartmentsClientProps } from "./interface";
import { useDepartments } from "./hooks/useDepartments";
import { useDepartmentFilters } from "./hooks/useDepartmentFilters";
import { useDepartmentModal } from "./hooks/useDepartmentModal";
import NotificationToast from "../Lecturer/Accounts/NotificationToast/NotificationToast";
import { DepartmentHeader } from "./DepartmentHeader/DepartmentHeader";
import { SearchAndFiltersBar } from "./SearchAndFiltersBar/SearchAndFiltersBar";
import { FilterPanel } from "./FilterPanel/FilterPanel";
import { EmptyState } from "../../common/EmptyState/EmptyState";
import { DepartmentsGrid } from "./DepartmentsGrid/DepartmentsGrid";
import { DepartmentsList } from "./DepartmentsList/DepartmentsList";
import { Pagination } from "./Pagination/Pagination";
import { DepartmentModal } from "./modals/DepartmentModal";
import { LoadingSkeleton } from "../Student/RegisteredExam/LoadingSkeleton/LoadingSkeleton";
import { useAuth } from "@/src/providers/auth/AuthContext";

export default function DepartmentClient({
  initialDepartments,
  initialMeta,
  initialSearchTerm,
}: IDepartmentsClientProps) {
  const { user: userData } = useAuth();
  const {
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
  } = useDepartments(initialDepartments, initialMeta);

  const {
    selectedDepartment,
    departmentStats,
    loadingStats,
    statsError,
    openModal,
    closeModal,
  } = useDepartmentModal();

  const { updateURL, performLocalSearch, handleSort, clearSearch } =
    useDepartmentFilters();

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Initialize search term
  useEffect(() => {
    if (initialSearchTerm) {
      setLocalSearchTermState(initialSearchTerm);
      setSearchTermState(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // Local search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        const handled = performLocalSearch(
          departments,
          localSearchTerm,
          updateFilteredDepartments,
          setSearchTermState,
          setIsSearchingState,
          updateURL,
          meta.limit,
          sortBy,
        );

        if (!handled && localSearchTerm) {
          performServerSearch();
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, searchTerm]);

  const performServerSearch = async () => {
    setLoadingState(true);
    try {
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", meta.limit.toString());
      params.append("sortBy", sortBy);
      params.append("institutionId", userData?.institutionId ?? "");
      if (localSearchTerm) {
        params.append("name", localSearchTerm);
      }

      const response = await fetch(`/api/v1/departments?${params}`);
      const data = await response.json();

      if (data.success) {
        updateDepartments(data.data, data.meta);
        setSearchTermState(localSearchTerm);
        updateURL(localSearchTerm, 1, meta.limit, sortBy);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to search departments. Please try again.",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoadingState(false);
      setIsSearchingState(false);
    }
  };

  const fetchPage = async (page: number) => {
    setLoadingState(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", meta.limit.toString());
      params.append("sortBy", sortBy);
      params.append("institutionId", userData?.institutionId ?? "");
      if (searchTerm) params.append("name", searchTerm);

      const response = await fetch(`/api/v1/departments?${params}`);
      const data = await response.json();

      if (data.success) {
        updateDepartments(data.data, data.meta);
        updateURL(searchTerm, page, meta.limit, sortBy);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to load departments",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoadingState(false);
    }
  };

  const handleSortChange = (sort: "name" | "createdAt") => {
    handleSort(
      sort,
      filteredDepartments,
      setSortByState,
      updateFilteredDepartments,
      fetchPage,
    );
  };

  const handleLimitChange = (limit: number) => {
    updateMetaLimit(limit);
    fetchPage(1);
  };

  const handleClearSearch = () => {
    clearSearch(
      setLocalSearchTermState,
      setSearchTermState,
      updateFilteredDepartments,
      departments,
      updateURL,
      meta.limit,
      sortBy,
    );
  };

  const resultsInfo = `Showing ${filteredDepartments.length} of ${searchTerm ? filteredDepartments.length : meta.totalItems} departments${searchTerm ? ` matching "${searchTerm}"` : ""}`;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <NotificationToast notification={notification} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DepartmentHeader />

        <SearchAndFiltersBar
          localSearchTerm={localSearchTerm}
          isSearching={isSearching}
          loading={loading}
          showFilters={showFilters}
          viewMode={viewMode}
          onSearchChange={setLocalSearchTermState}
          onClearSearch={handleClearSearch}
          onToggleFilters={() => setShowFiltersState(!showFilters)}
          onViewModeChange={setViewModeState}
        />

        {showFilters && (
          <FilterPanel
            sortBy={sortBy}
            limit={meta.limit}
            onSortChange={handleSortChange}
            onLimitChange={handleLimitChange}
          />
        )}

        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">{resultsInfo}</p>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : filteredDepartments.length === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
            onClearSearch={handleClearSearch}
            description="No departments found"
            title="Departments"
          />
        ) : viewMode === "grid" ? (
          <DepartmentsGrid
            departments={filteredDepartments}
            onViewDetails={openModal}
          />
        ) : (
          <DepartmentsList
            departments={filteredDepartments}
            onViewDetails={openModal}
          />
        )}

        {meta.totalPages > 1 && !searchTerm && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            hasNextPage={meta.hasNextPage}
            hasPreviousPage={meta.hasPreviousPage}
            onPageChange={fetchPage}
          />
        )}

        {searchTerm && filteredDepartments.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing local search results. For more results, try a different
            search term.
          </div>
        )}
      </div>

      {selectedDepartment && (
        <DepartmentModal
          department={selectedDepartment}
          stats={departmentStats}
          loading={loadingStats}
          error={statsError}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
