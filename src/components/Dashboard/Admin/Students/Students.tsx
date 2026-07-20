"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  IStudent,
  IStudentManagenementProps,
  IStudentManagenementResponse,
  TActionType,
} from "./interface";
import { ModalWrapper } from "./modals/wrapper";
import { StudentTableRow } from "./StudentTable/StudentTable";
import { useAuth } from "@/src/providers/auth/AuthContext";
import { toast } from "react-toastify";
import LoadingOverlay from "@/src/components/common/LoadingOverlay/LoadingOverlay";
import { SearchFilter } from "./SearchFilter/SearchFilter";
import PageNavigation from "@/src/components/common/PageNavigation/PageNavigation";

export default function Students({ initialData }: IStudentManagenementProps) {
  const { user: currentUser } = useAuth();

  const abortControllerRef = useRef<null | AbortController>(null);

  const [unfilteredStudents, setUnfilteredStudents] = useState<
    IStudentManagenementResponse["data"]
  >(() => {
    if (!initialData?.success) {
      toast.error(initialData?.message || "Failed to load complaints");
      return [];
    }
    return initialData?.data ?? [];
  });

  const [filteredStudents, setFilteredStudents] = useState<
    IStudentManagenementResponse["data"]
  >([]);

  const [unfilteredMeta, setUnfilteredMeta] = useState<
    IStudentManagenementResponse["meta"]
  >(
    initialData?.meta ?? {
      hasNextPage: false,
      hasPreviousPage: false,
      limit: 20,
      page: 1,
      totalItems: 0,
      totalPages: 0,
    },
  );
  const [filteredMeta, setFilteredMeta] = useState<
    IStudentManagenementResponse["meta"] | null
  >(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [studentIdFilter, setStudentIdFilter] = useState("");
  const [isSuspendedFilter, setisSuspendedFilter] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState<{
    type: TActionType;
    student: IStudent | null;
  }>({
    type: null,
    student: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuspendingLoading, setIsSuspendingLoading] = useState(false);
  const [isUnSuspendingLoading, setIsUnSuspendingLoading] = useState(false);

  const isFilteringActive = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      studentIdFilter?.trim() !== "" ||
      isSuspendedFilter.trim() !== ""
    );
  }, [searchQuery, isSuspendedFilter, studentIdFilter]);

  useEffect(() => {
    if (isFilteringActive) {
      setFilteredStudents([]);
      setFilteredMeta(null);
      setCurrentPage(1);
      fetchFilteredServerPage(1);
    }
  }, [searchQuery, isSuspendedFilter, studentIdFilter, isFilteringActive]);

  const itemsPerPage = 5;

  const fetchNextUnfilteredPage = async (nextServerPage: number) => {
    if (isLoading) return;
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/admin/students-management?page=${nextServerPage}&limit=${unfilteredMeta.limit}`,
        {
          signal: controller.signal,
        },
      );
      const result: IStudentManagenementResponse = await response.json();

      if (result?.success) {
        setUnfilteredStudents((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const uniques = result.data.filter((c) => !existingIds.has(c.id));
          return [...prev, ...uniques];
        });
        setUnfilteredMeta(result.meta);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("fetch Aborted");
        return;
      }
      toast.error("Network error fetching more records");
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  const fetchFilteredServerPage = async (targetPage: number) => {
    if (isLoading) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", `${targetPage}`);
      queryParams.append("limit", `${unfilteredMeta.limit}`);
      if (searchQuery.trim()) queryParams.append("name", searchQuery);
      if (studentIdFilter !== "")
        queryParams.append("studentId", studentIdFilter);
      if (isSuspendedFilter !== "" && isSuspendedFilter !== "All") {
        queryParams.append("isSuspended", isSuspendedFilter);
      } else {
        queryParams.delete("isSuspended");
      }

      const response = await fetch(
        `/api/v1/admin/students-management?${queryParams.toString()}`,
        {
          signal: controller.signal,
        },
      );
      const result: IStudentManagenementResponse = await response.json();

      if (result?.success) {
        setFilteredStudents(result.data);
        setFilteredMeta(result.meta);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch Aborted");
        return;
      }
      toast.error("Error evaluating search query parameters");
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  const displayRecords = useMemo(() => {
    if (isFilteringActive) {
      const students = unfilteredStudents.filter(
        (s) =>
          s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s?.lastName?.toLowerCase()?.includes(searchQuery.toLowerCase()),
      );
      if (students.length > 0) return students;
      return filteredStudents;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return unfilteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [isFilteringActive, filteredStudents, unfilteredStudents, currentPage]);

  const totalPages = useMemo(() => {
    if (isFilteringActive) {
      return filteredMeta
        ? Math.ceil(filteredMeta.totalItems / itemsPerPage)
        : 1;
    }
    return Math.ceil(unfilteredMeta.totalItems / itemsPerPage);
  }, [isFilteringActive, filteredMeta, unfilteredMeta.totalItems]);

  const handlePageChange = (newPage: number) => {
    if (isFilteringActive) {
      fetchFilteredServerPage(newPage).then(() => {
        setCurrentPage(newPage);
      });
    } else {
      const requiredItemIndex = (newPage - 1) * itemsPerPage;
      if (
        requiredItemIndex >= unfilteredStudents.length &&
        unfilteredStudents.length < unfilteredMeta.totalItems
      ) {
        const nextServerPage =
          Math.floor(unfilteredStudents.length / unfilteredMeta.limit) + 1;
        fetchNextUnfilteredPage(nextServerPage).then(() => {
          setCurrentPage(newPage);
        });
      } else {
        setCurrentPage(newPage);
      }
    }
  };

  const handleSuspend = async (
    student: IStudent,
    action: "suspend" | "unsuspend",
    reason?: string,
  ) => {
    try {
      if (student.suspended && action === "suspend") {
        toast.error("Student is already suspended!");
        return;
      }

      if (!student.suspended && action === "unsuspend") {
        toast.error("Student is not suspended!");
        return;
      }
      setModalState({ student: null, type: null });

      if (action === "suspend") {
        setIsSuspendingLoading(true);
      } else {
        setIsUnSuspendingLoading(true);
      }
      setActiveDropdownId(null);

      const response = await fetch(`/api/v1/admin/students-management`, {
        method: "POST",
        body: JSON.stringify({
          suspend: action === "suspend" ? true : false,
          studentId: student.id,
          reason,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message ?? "Could perform action");
        return;
      }

      toast.success("Complaint status marked as resolved");
      setUnfilteredStudents((prev) =>
        prev.map((item) =>
          item.id === student.id
            ? {
                ...item,
                suspended: action === "suspend" ? true : false,
                suspendedBy:
                  action === "suspend"
                    ? {
                        id: currentUser?.id ?? "",
                        firstName: currentUser?.firstName ?? "",
                        lastName: currentUser?.lastName ?? "",
                      }
                    : student.suspendedBy,
              }
            : item,
        ),
      );

      if (filteredStudents.length > 0) {
        setFilteredStudents((prev) =>
          prev.map((item) =>
            item.id === student.id
              ? {
                  ...item,
                  suspended: action === "suspend" ? true : false,
                  suspendedBy:
                    action === "suspend"
                      ? {
                          id: currentUser?.id ?? "",
                          firstName: currentUser?.firstName ?? "",
                          lastName: currentUser?.lastName ?? "",
                        }
                      : student.suspendedBy,
                }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error("error: ", error);
    } finally {
      if (action === "suspend") {
        setIsSuspendingLoading(false);
      } else {
        setIsUnSuspendingLoading(false);
      }
    }
  };

  const handleAction = (type: TActionType, student: IStudent) => {
    setModalState({ type, student });
    setActiveDropdownId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 flex justify-center text-slate-800">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm p-6 border border-slate-100 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-4">Students</h1>

          <SearchFilter
            isSuspendedFilter={isSuspendedFilter}
            searchQuery={searchQuery}
            setCurrentPage={setCurrentPage}
            setIsSuspendedFilter={setisSuspendedFilter}
            setSearchQuery={setSearchQuery}
          />

          {isSuspendingLoading && (
            <LoadingOverlay message="Suspending Student" />
          )}
          {isUnSuspendingLoading && (
            <LoadingOverlay message="Unsuspending Student" />
          )}

          <div className="w-full overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full min-w-175 border-collapse text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-900">
                <tr>
                  <th scope="col" className="py-3 px-4 w-[10%]">
                    Photo
                  </th>
                  <th scope="col" className="py-3 px-4 w-[30%]">
                    Name
                  </th>
                  <th scope="col" className="py-3 px-4 w-[20%]">
                    Student ID
                  </th>
                  <th scope="col" className="py-3 px-4 w-[25%]">
                    Email
                  </th>
                  <th scope="col" className="py-3 px-4 w-[25%]">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-4 w-[25%]">
                    Suspended By
                  </th>
                  <th scope="col" className="py-3 px-4 w-[15%] text-right pr-6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayRecords.length > 0 ? (
                  displayRecords.map((student) => (
                    <StudentTableRow
                      key={student.id}
                      student={student}
                      activeDropdownId={activeDropdownId}
                      onAction={handleAction}
                      onSetActiveDropdownId={setActiveDropdownId}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-12 text-slate-400 font-medium"
                    >
                      No match found for student criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <PageNavigation
            currentPage={currentPage}
            filteredData={displayRecords}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
            dataType="Students"
          />
        )}
      </div>

      {modalState.type && modalState.student && (
        <ModalWrapper
          modalState={modalState}
          onSetModalState={setModalState}
          handleSuspend={handleSuspend}
        />
      )}
    </div>
  );
}
