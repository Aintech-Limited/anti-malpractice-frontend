"use client";

import { useState, useMemo, useEffect } from "react";
import { MoreVertical, TrendingUp } from "lucide-react";
import {
  IAdminComplaintResponse,
  IAdminComplaintsManagerProps,
  IComplaintRecord,
  TAssigneeAdmins,
} from "./interface";
import { ComplaintAnalytics } from "./ComplaitAnalytics/ComplaintAnalytics";
import { SearchFilter } from "./SearchFilter/SearchFilter";
import { PaginationAction } from "./PaginationAction/PaginationAction";
import { SidedrawerModal } from "./SidedrawerModal/SidedrawerModal";
import {
  ComplaintPriorityEnum,
  ComplaintStatusEnum,
  TComplaintCategoryEnum,
  TComplaintStatusEnum,
} from "@/src/lib/enums";
import { toast } from "react-toastify";
import LoadingOverlay from "@/src/components/common/LoadingOverlay/LoadingOverlay";
import { useAuth } from "@/src/providers/auth/AuthContext";
import ActiveComplaintMenu from "./ActiveComplaintMenu/ActiveComplaintMenu";

export default function AdminComplaintsManager({
  initialComplaints,
  message,
  meta: initialMeta,
  success,
}: IAdminComplaintsManagerProps) {
  const { user: currentUser } = useAuth();

  const [unfilteredComplaints, setUnfilteredComplaints] = useState<
    IComplaintRecord[]
  >(() => {
    if (!success) {
      toast.error(message || "Failed to load complaints");
      return [];
    }
    return initialComplaints ?? [];
  });

  const [filteredComplaints, setFilteredComplaints] = useState<
    IComplaintRecord[]
  >([]);

  const [unfilteredMeta, setUnfilteredMeta] = useState<
    IAdminComplaintResponse["meta"]
  >(
    initialMeta ?? {
      hasNextPage: false,
      hasPreviousPage: false,
      limit: 20,
      page: 1,
      totalItems: 0,
      totalPages: 0,
    },
  );
  const [filteredMeta, setFilteredMeta] = useState<
    IAdminComplaintResponse["meta"] | null
  >(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | TComplaintStatusEnum
  >("All");
  const [categoryFilter, setCategoryFilter] = useState<
    "All" | TComplaintCategoryEnum
  >("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialMeta?.page ?? 1);
  const [selectedComplaint, setSelectedComplaint] =
    useState<IComplaintRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAsResolvedLoading, setIsMarkingAsResolvedLoading] =
    useState(false);
  const [isAssigninToMeLoading, setIsAssigninToMeLoading] = useState(false);
  const [isEscalateLoading, setIsEscalateLoading] = useState(false);
  const [isInProgressLoading, setIsInProgressLoading] = useState(false);
  const [admins, setAdmins] = useState<TAssigneeAdmins[]>([]);

  const itemsPerPage = 10;

  const isFilteringActive = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      statusFilter !== "All" ||
      categoryFilter !== "All"
    );
  }, [searchQuery, statusFilter, categoryFilter]);

  useEffect(() => {
    setCurrentPage(1);
    setFilteredComplaints([]);
    setFilteredMeta(null);

    if (isFilteringActive) {
      fetchFilteredServerPage(1);
    }
  }, [searchQuery, statusFilter, categoryFilter, isFilteringActive]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("/api/v1/users/admins", {
          method: "GET",
        });

        const data = (await response.json()) as {
          message: string;
          success: boolean;
          data: TAssigneeAdmins[];
        };

        if (data.success) {
          setAdmins(data.data);
        } else {
          toast.error(data?.message ?? "Could not retrieved Admins");
        }
      } catch (error) {
        console.error("error: ", error);
      }
    };

    fetchAdmins();
  }, []);

  const fetchNextUnfilteredPage = async (nextServerPage: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/complaints/admins?page=${nextServerPage}&limit=${unfilteredMeta.limit}`,
      );
      const result: IAdminComplaintResponse = await response.json();

      if (result?.success) {
        setUnfilteredComplaints((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const uniques = result.data.filter((c) => !existingIds.has(c.id));
          return [...prev, ...uniques];
        });
        setUnfilteredMeta(result.meta);
      }
    } catch (error) {
      toast.error("Network error fetching more records");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilteredServerPage = async (targetPage: number) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", `${targetPage}`);
      queryParams.append("limit", `${unfilteredMeta.limit}`);
      if (searchQuery.trim()) queryParams.append("search", searchQuery);
      if (statusFilter !== "All") queryParams.append("status", statusFilter);
      if (categoryFilter !== "All")
        queryParams.append("category", categoryFilter);

      const response = await fetch(
        `/api/v1/complaints/admins?${queryParams.toString()}`,
      );
      const result: IAdminComplaintResponse = await response.json();

      if (result?.success) {
        setFilteredComplaints(result.data);
        setFilteredMeta(result.meta);
      }
    } catch (error) {
      toast.error("Error evaluating search query parameters");
    } finally {
      setIsLoading(false);
    }
  };

  const displayRecords = useMemo(() => {
    if (isFilteringActive) {
      return filteredComplaints;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return unfilteredComplaints.slice(startIndex, startIndex + itemsPerPage);
  }, [
    isFilteringActive,
    filteredComplaints,
    unfilteredComplaints,
    currentPage,
  ]);

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
        requiredItemIndex >= unfilteredComplaints.length &&
        unfilteredComplaints.length < unfilteredMeta.totalItems
      ) {
        const nextServerPage =
          Math.floor(unfilteredComplaints.length / unfilteredMeta.limit) + 1;
        fetchNextUnfilteredPage(nextServerPage).then(() => {
          setCurrentPage(newPage);
        });
      } else {
        setCurrentPage(newPage);
      }
    }
  };

  const metrics = useMemo(() => {
    return {
      total: unfilteredMeta.totalItems,
      pending: unfilteredComplaints.filter(
        (c) => c.status === ComplaintStatusEnum.PENDING,
      ).length,
      inProgress: unfilteredComplaints.filter(
        (c) => c.status === ComplaintStatusEnum.IN_PROGRESS,
      ).length,
      resolved: unfilteredComplaints.filter(
        (c) => c.status === ComplaintStatusEnum.RESOLVED,
      ).length,
    };
  }, [unfilteredComplaints, unfilteredMeta.totalItems]);

  const handleMarkAsResolved = async (record: IComplaintRecord) => {
    try {
      if (record.status === ComplaintStatusEnum.RESOLVED) {
        toast.error("Complaint already marked as resolved!");
        return;
      }
      if (record?.assignedTo?.id !== currentUser?.id) {
        toast.error("Cannot resolve Complaint. Complaint not assigned to you!");
        return;
      }
      setIsMarkingAsResolvedLoading(true);
      setActiveMenuId(null);

      const response = await fetch(`/api/v1/complaints/admins`, {
        method: "PATCH",
        body: JSON.stringify({
          status: ComplaintStatusEnum.RESOLVED,
          id: record.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message ?? "Could not mark complaint as resolved");
        return;
      }

      toast.success("Complaint status marked as resolved");
      setUnfilteredComplaints((prev) =>
        prev.map((item) =>
          item.id === record.id
            ? {
                ...item,
                status: ComplaintStatusEnum.RESOLVED,
              }
            : item,
        ),
      );

      if (filteredComplaints.length > 0) {
        setFilteredComplaints((prev) =>
          prev.map((item) =>
            item.id === record.id
              ? {
                  ...item,
                  status: ComplaintStatusEnum.RESOLVED,
                }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setIsMarkingAsResolvedLoading(false);
    }
  };

  const handleAssignToMe = async (record: IComplaintRecord) => {
    try {
      if (record.status === ComplaintStatusEnum.RESOLVED) {
        toast.error("Cannot reassign resolved Complaint!");
        return;
      }
      if (record?.assignedTo?.id === currentUser?.id) {
        toast.info("Complaint already assigned to you!");
        return;
      }
      if (record.assignedTo) {
        toast.error(
          "Cannot reassign Complaint to self, Complaint already assigned!",
        );
        return;
      }

      setIsAssigninToMeLoading(true);
      setActiveMenuId(null);

      const response = await fetch(`/api/v1/complaints/admins`, {
        method: "PATCH",
        body: JSON.stringify({
          assignedToId: currentUser?.id,
          status: ComplaintStatusEnum.IN_PROGRESS,
          id: record.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message ?? "Could not assign complaint to you");
        return;
      }

      toast.success("Complaint assigned to you");
      const updatedAssignee = {
        id: currentUser?.id ?? "",
        firstName: currentUser?.firstName ?? "",
        lastName: currentUser?.lastName ?? "",
      };

      setUnfilteredComplaints((prev) =>
        prev.map((item) =>
          item.id === record.id
            ? {
                ...item,
                status: ComplaintStatusEnum.IN_PROGRESS,
                assignedTo: updatedAssignee,
              }
            : item,
        ),
      );

      if (filteredComplaints.length > 0) {
        setFilteredComplaints((prev) =>
          prev.map((item) =>
            item.id === record.id
              ? {
                  ...item,
                  status: ComplaintStatusEnum.IN_PROGRESS,
                  assignedTo: updatedAssignee,
                }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setIsAssigninToMeLoading(false);
    }
  };

  const handleSetInProgress = async (record: IComplaintRecord) => {
    try {
      if (record.status === ComplaintStatusEnum.RESOLVED) {
        toast.error("Cannot modify resolved Complaint!");
        return;
      }
      if (record.status === ComplaintStatusEnum.IN_PROGRESS) {
        toast.error("Complaint is already in progress!");
        return;
      }
      if (record?.assignedTo?.id !== currentUser?.id) {
        toast.error("Complaint is not assigned to you!");
        return;
      }
      setIsInProgressLoading(true);
      setActiveMenuId(null);

      const response = await fetch(`/api/v1/complaints/admins`, {
        method: "PATCH",
        body: JSON.stringify({
          status: ComplaintStatusEnum.IN_PROGRESS,
          id: record.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message ?? "Could not set status as in progress");
        return;
      }

      toast.success("Complaint status updated to in progress");
      if (filteredComplaints.length > 0) {
        setFilteredComplaints(() =>
          displayRecords.map((mappedRecord) => {
            return {
              ...mappedRecord,
              status:
                mappedRecord.id === record.id
                  ? ComplaintStatusEnum.IN_PROGRESS
                  : record.status,
            };
          }),
        );
      } else {
        setUnfilteredComplaints(() =>
          displayRecords.map((mappedRecord) => {
            return {
              ...mappedRecord,
              status:
                mappedRecord.id === record.id
                  ? ComplaintStatusEnum.IN_PROGRESS
                  : record.status,
            };
          }),
        );
      }
    } catch (error) {
    } finally {
      setIsInProgressLoading(false);
    }
  };

  const handleEscalateComplaint = async (
    record: IComplaintRecord,
    assignee: TAssigneeAdmins,
  ) => {
    try {
      setSelectedComplaint(null);
      setIsEscalateLoading(true);

      if (assignee?.id === currentUser?.id) {
        toast.error("Cannot escalate Complaint to yourself!");
        return;
      }
      if (record.assignedTo && record?.assignedTo?.id !== currentUser?.id) {
        toast.error("Cannot escalate Complaint not assigned to you!");
        return;
      }
      if (record.status === ComplaintStatusEnum.RESOLVED) {
        toast.error("Cannot escalate resolved Complaint!");
        return;
      }

      const response = await fetch(`/api/v1/complaints/admins`, {
        method: "PATCH",
        body: JSON.stringify({
          assignedToId: assignee?.id,
          status: ComplaintStatusEnum.PENDING,
          id: record.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message ?? "Could not assign Complaint ");
        return;
      }

      toast.success("Complaint assigned successfully.");
      setUnfilteredComplaints((prev) =>
        prev.map((item) =>
          item.id === record.id
            ? {
                ...item,
                status: ComplaintStatusEnum.PENDING,
                assignedTo: assignee,
              }
            : item,
        ),
      );

      if (filteredComplaints.length > 0) {
        setFilteredComplaints((prev) =>
          prev.map((item) =>
            item.id === record.id
              ? {
                  ...item,
                  status: ComplaintStatusEnum.PENDING,
                  assignedTo: assignee,
                }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setIsEscalateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Complaints Resolution Control
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Review, dispatch, and track regional public complaint tickers.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs text-xs font-bold text-emerald-600">
          <TrendingUp className="w-4 h-4" /> System Live Account
        </div>
      </div>

      <ComplaintAnalytics metrics={metrics} />

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs overflow-visible">
        {isLoading && <LoadingOverlay message="Syncing data engine" />}
        {isMarkingAsResolvedLoading && (
          <LoadingOverlay message="Marking as resolved" />
        )}
        {isAssigninToMeLoading && <LoadingOverlay message="Assigning to me" />}
        {isEscalateLoading && <LoadingOverlay message="Escalating Complaint" />}
        {isInProgressLoading && (
          <LoadingOverlay message="Setting in progress" />
        )}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchFilter
            searchQuery={searchQuery}
            setCurrentPage={setCurrentPage}
            setSearchQuery={setSearchQuery}
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
            setCategoryFilter={setCategoryFilter}
            categoryFilter={categoryFilter}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider bg-slate-50/50">
                <th className="py-4 px-6">Complaint ID</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Location Reference</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Priority</th>
                <th className="py-4 px-4">Assignee</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {displayRecords.length > 0 ? (
                displayRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {record.id}
                    </td>

                    <td className="py-4 px-4 text-slate-900 font-semibold">
                      {record.category.replaceAll("_", " ")}
                    </td>

                    <td className="py-4 px-4 text-slate-500 max-w-45 truncate">
                      {record.location}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          record.status === ComplaintStatusEnum.PENDING
                            ? "bg-rose-50 text-rose-600 border border-rose-100"
                            : record.status === ComplaintStatusEnum.IN_PROGRESS
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                      >
                        {record.status?.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`font-bold ${
                          record.priority === ComplaintPriorityEnum.HIGH
                            ? "text-rose-500"
                            : record.priority === ComplaintPriorityEnum.MEDIUM
                              ? "text-amber-500"
                              : "text-slate-400"
                        }`}
                      >
                        {record.priority}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-semibold">
                      {`${record?.assignedTo?.firstName ?? ""} ${record?.assignedTo?.lastName ?? ""}`}
                    </td>

                    <td className="py-4 px-6 text-right relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(
                            activeMenuId === record.id ? null : record.id,
                          )
                        }
                        className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-black rounded-lg transition"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === record.id && (
                        <ActiveComplaintMenu
                          handleAssignToMe={handleAssignToMe}
                          handleMarkAsResolved={handleMarkAsResolved}
                          handleSetInProgress={handleSetInProgress}
                          record={record}
                          setActiveMenuId={setActiveMenuId}
                          setSelectedComplaint={setSelectedComplaint}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-slate-400 font-medium"
                  >
                    No complaints matching your filtering options found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <PaginationAction
            currentPage={currentPage}
            filteredRecords={displayRecords}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          />
        )}
      </div>

      {selectedComplaint && (
        <SidedrawerModal
          selectedComplaint={selectedComplaint}
          setSelectedComplaint={setSelectedComplaint}
          handleEscalateComplaint={handleEscalateComplaint}
          admins={admins}
          currentUser={currentUser!}
        />
      )}
    </div>
  );
}
