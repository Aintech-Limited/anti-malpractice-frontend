"use client";

import { useState } from "react";
import { Search, Filter, FileText } from "lucide-react";
import {
  IAdminExam,
  IAdminExamFilters,
  IAdminExamFullDetails,
  IAdminExamsClientProps,
  IAdminExamsResponse,
} from "./interface";
import AdminExamCard from "./ExamCard/ExamCard";
import AdminExamDetailsModal from "./ExamDetailsModal/ExamDetailsModal";
import AdminApproveExamModal from "./ApproveExamModal/ApproveExamModal";
import AdminRequestChangesModal from "./RequestChangesModal/RequestChangesModal";
import { toast } from "react-toastify";
import { parseHTMLDateToDateObj } from "@/src/lib/helper";
import ExamStatsCard from "./ExamStatsCard/ExamStatsCard";
import ExamFilters from "./ExamFilters/ExamFilters";
import ExamPagination from "./ExamPagination/ExamPagination";
import AdminReleaseResultModal from "./ReleaseResultModal/ReleaseResultModal";
import AdminGradeExamModal from "./GradeExamModal/GradeExamModal";

export default function ExamsClient({
  initialData,
  initialPage,
  limit,
  departments,
  courses,
}: IAdminExamsClientProps) {
  const [exams, setExams] = useState<IAdminExam[]>(initialData.data ?? []);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [total, setTotal] = useState(initialData.total);
  const [hasNextPage, setHasNextPage] = useState(initialData.hasNextPage);
  const [hasPreviousPage, setHasPreviousPage] = useState(
    initialData.hasPreviousPage,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IAdminExamFilters>({
    page: initialPage,
    limit: limit,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [changesModalOpen, setChangesModalOpen] = useState(false);
  const [gradeExamModalOpen, setGradeExamModalOpen] = useState(false);
  const [releaseResultModalOpen, setReleaseResultModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<IAdminExam | null>(null);

  const loadExams = async (page: number, currentFilters: IAdminExamFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (currentFilters.search) params.append("search", currentFilters.search);
      if (currentFilters.adminStatus)
        params.append("adminStatus", currentFilters.adminStatus);
      if (currentFilters.type_) params.append("type_", currentFilters.type_);
      if (currentFilters.departmentId)
        params.append("departmentId", currentFilters.departmentId);
      if (currentFilters.courseId)
        params.append("courseId", currentFilters.courseId);
      if (currentFilters.published !== undefined)
        params.append("published", String(currentFilters.published));
      if (currentFilters.startDate) {
        params.append(
          "startDate",
          parseHTMLDateToDateObj(currentFilters.startDate).toString(),
        );
      }
      if (currentFilters.endDate) {
        params.append(
          "endDate",
          parseHTMLDateToDateObj(currentFilters.endDate).toString(),
        );
      }

      const response = await fetch(`/api/v1/admin/exam?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch exams: ${response.statusText}`);
      }

      const result: IAdminExamsResponse = await response.json();

      if (result.success) {
        setExams(result.data);
        setCurrentPage(result.page);
        setTotal(result.total);
        setHasNextPage(result.hasNextPage);
        setHasPreviousPage(result.hasPreviousPage);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error fetching exams:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchExamDetails = async (
    examId: string,
  ): Promise<{
    data?: IAdminExamFullDetails;
    message: string;
    success: boolean;
  }> => {
    try {
      const response = await fetch(`/api/v1/admin/exam/${examId}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching exam details:", error);
      return {
        message: "failed",
        success: false,
      };
    }
  };

  const handleApproveExam = async (examId: string, notes?: string) => {
    try {
      const response = await fetch(`/api/v1/admin/exam/${examId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, approved: true }),
      });

      const result = await response.json();
      if (result.success) {
        await loadExams(currentPage, filters);
        toast.success("Exam approved successfully!");
      } else {
        toast.error(`Failed to approve exam: ${result.message}`);
      }
    } catch (error) {
      console.error("Error approving exam:", error);
      toast.error("Failed to approve exam. Please try again.");
    }
  };

  const handleRequestChanges = async (examId: string, changes: string) => {
    if (!changes) {
      toast.error("Must provide changes needed when exam is not approved");
      return;
    }
    try {
      const response = await fetch(`/api/v1/admin/exam/${examId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes, approved: false }),
      });

      const result = await response.json();
      if (result.success) {
        await loadExams(currentPage, filters);
        toast.success("Changes requested successfully!");
      } else {
        toast.error(`Failed to request changes: ${result.message}`);
      }
      return result;
    } catch (error) {
      console.error("Error requesting changes:", error);
      toast.error("Failed to request changes. Please try again.");
    }
  };

  const handleReleaseResult = async (examId: string) => {
    try {
      const response = await fetch(`/api/v1/admin/exam/${examId}/release`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error releasing results:", error);
      return {
        message: "Failed to release Exam. Please try again.",
        success: false,
      };
    }
  };
  const handlegradeExam = async (examId: string) => {
    try {
      const response = await fetch(`/api/v1/admin/exam/${examId}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error grading results:", error);
      return {
        message: "Failed to grade Exam. Please try again.",
        success: false,
      };
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && !loading) {
      const newPage = currentPage + 1;
      setFilters({ ...filters, page: newPage });
      loadExams(newPage, { ...filters, page: newPage });
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage && !loading) {
      const newPage = currentPage - 1;
      setFilters({ ...filters, page: newPage });
      loadExams(newPage, { ...filters, page: newPage });
    }
  };

  const handleSearch = () => {
    const newFilters = { ...filters, search: searchTerm || undefined, page: 1 };
    setFilters(newFilters);
    loadExams(1, newFilters);
  };

  const handleApplyFilters = (newFilters: Partial<IAdminExamFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    loadExams(1, updatedFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { page: 1, limit: limit };
    setFilters(clearedFilters);
    setSearchTerm("");
    loadExams(1, clearedFilters);
    setShowFilters(false);
  };

  const getStatusCounts = () => {
    const approved = exams.filter((e) => e.adminStatus === "APPROVED").length;
    const notApproved = exams.filter(
      (e) => e.adminStatus === "NOT_APPROVED",
    ).length;
    const changesRequested = exams.filter(
      (e) => e.adminStatus === "CHANGES_REQUESTED",
    ).length;
    const published = exams.filter((e) => e.published).length;
    return {
      approved,
      notApproved,
      changesRequested,
      published,
      total: exams.length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Exams Management</h1>
          <div className="text-sm text-gray-500">({total} total)</div>
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by title, course code..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border rounded-lg transition ${showFilters ? "bg-indigo-100 border-indigo-300 text-indigo-600" : "bg-white border-gray-200 text-gray-400"}`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <ExamStatsCard
        approved={counts.approved}
        changesRequested={counts.changesRequested}
        notApproved={counts.notApproved}
        published={counts.published}
        total={counts.total}
      />

      {/* Filters Panel */}
      {showFilters && (
        <ExamFilters
          courses={courses}
          departments={departments}
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          onSetFIlters={setFilters}
          onShowFIlters={setShowFilters}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* List Section */}
      <div className="space-y-4">
        {exams.map((exam) => (
          <AdminExamCard
            key={exam.id}
            exam={exam}
            onViewDetails={(e) => {
              setSelectedExam(e);
              setDetailsModalOpen(true);
            }}
            onApprove={(e) => {
              setSelectedExam(e);
              setApproveModalOpen(true);
            }}
            onRequestChanges={(e) => {
              setSelectedExam(e);
              setChangesModalOpen(true);
            }}
            onGradeExam={(e) => {
              setSelectedExam(e);
              setGradeExamModalOpen(true);
            }}
            onReleaseResult={(e) => {
              setSelectedExam(e);
              setReleaseResultModalOpen(true);
            }}
          />
        ))}
      </div>

      {exams.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No exams found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try adjusting your filters or search term
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {total > 0 && (
        <ExamPagination
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          limit={limit}
          loading={loading}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          total={total}
        />
      )}

      {/* Modals */}
      <AdminExamDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedExam(null);
        }}
        exam={selectedExam}
        onFetchDetails={handleFetchExamDetails}
      />

      <AdminReleaseResultModal
        isOpen={releaseResultModalOpen}
        onClose={() => {
          setReleaseResultModalOpen(false);
          setSelectedExam(null);
        }}
        exam={selectedExam}
        onReleaseResult={handleReleaseResult}
      />

      <AdminGradeExamModal
        isOpen={gradeExamModalOpen}
        onClose={() => {
          setGradeExamModalOpen(false);
          setSelectedExam(null);
        }}
        exam={selectedExam}
        ongradeExam={handlegradeExam}
      />

      <AdminApproveExamModal
        isOpen={approveModalOpen}
        onClose={() => {
          setApproveModalOpen(false);
          setSelectedExam(null);
        }}
        onConfirm={handleApproveExam}
        exam={selectedExam}
      />

      <AdminRequestChangesModal
        isOpen={changesModalOpen}
        onClose={() => {
          setChangesModalOpen(false);
          setSelectedExam(null);
        }}
        onConfirm={handleRequestChanges}
        exam={selectedExam}
      />
    </div>
  );
}
