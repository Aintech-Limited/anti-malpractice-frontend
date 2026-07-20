"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Award,
  MoreHorizontal,
  UserX,
  UserCheck,
  Send,
} from "lucide-react";
import { IDepartmentStudent, IStudentsClientProps } from "./interface";
import BlockStudentModal from "./BlockStudentModal/BlockStudentModal";
import UnblockStudentModal from "./UnblockStudentModal/UnblockStudentModal";
import SendEmailModal from "./SendEmailModal/SendEmailModal";
import { toast } from "react-toastify";
import { formatDate } from "@/src/lib/helper";
import {
  DepartmentStudentSortEnum,
  TDepartmentStudentSortEnumValue,
  TEmailTemplateEnum,
} from "@/src/lib/enums";
import { EmptyState } from "@/src/components/common/EmptyState/EmptyState";

export default function DepartmentStudentsClient({
  departmentId,
  initialData,
  initialPage,
  limit,
}: IStudentsClientProps) {
  const [students, setStudents] = useState<IDepartmentStudent[]>(
    initialData.data,
  );
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasNextPage, setHasNextPage] = useState(initialData.meta.hasNextPage);
  const [hasPreviousPage, setHasPreviousPage] = useState(
    initialData.meta.hasPreviousPage,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentSort, setStudentSort] =
    useState<TDepartmentStudentSortEnumValue>(DepartmentStudentSortEnum.ALL);

  // Modal states
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [unblockModalOpen, setUnblockModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<IDepartmentStudent | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadStudents = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/v1/admin/students?departmentId=${departmentId}&page=${page}&limit=${limit}&studentStatus=${studentSort}`,
        {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setStudents(result.data);
        setCurrentPage(result.meta.page);
        setHasNextPage(result.meta.hasNextPage);
        setHasPreviousPage(result.meta.hasPreviousPage);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && !loading) {
      loadStudents(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage && !loading) {
      loadStudents(currentPage - 1);
    }
  };

  const handleBlockStudent = async () => {
    if (!selectedStudent) return;
    setActionLoading(true);

    try {
      const response = await fetch("/api/v1/admin/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          blockType: "block",
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadStudents(currentPage);
        toast.success(
          `Student ${selectedStudent.firstName} ${selectedStudent.lastName} has been blocked`,
        );
      } else {
        toast.success(`Failed to block student: ${result.message}`);
      }
    } catch (error) {
      console.error("Error blocking student:", error);
      toast.success("Failed to block student. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockStudent = async () => {
    if (!selectedStudent) return;
    setActionLoading(true);

    try {
      const response = await fetch("/api/v1/admin/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          blockType: "unblock",
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadStudents(currentPage);
        toast.success(
          `Student ${selectedStudent.firstName} ${selectedStudent.lastName} has been unblocked`,
        );
      } else {
        toast.success(`Failed to unblock student: ${result.message}`);
      }
    } catch (error) {
      console.error("Error unblocking student:", error);
      toast.success("Failed to unblock student. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async (
    emailTemplateType: TEmailTemplateEnum,
    customMessage?: string,
  ) => {
    if (!selectedStudent) return;
    setActionLoading(true);

    try {
      const response = await fetch("/api/v1/admin/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentEmail: selectedStudent.email,
          studentId: selectedStudent.id,
          emailTemplateType,
          customMessage,
          sendEmail: true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Email sent successfully to ${selectedStudent.firstName} ${selectedStudent.lastName}`,
        );
      } else {
        toast.success(`Failed to send email: ${result.message}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.success("Failed to send email. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const openBlockModal = (student: IDepartmentStudent) => {
    setSelectedStudent(student);
    setBlockModalOpen(true);
  };

  const openUnblockModal = (student: IDepartmentStudent) => {
    setSelectedStudent(student);
    setUnblockModalOpen(true);
  };

  const openEmailModal = (student: IDepartmentStudent) => {
    setSelectedStudent(student);
    setEmailModalOpen(true);
  };

  const getFullName = (student: IDepartmentStudent) => {
    return `${student.firstName} ${student.lastName}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Students List</h1>
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none text-gray-500 min-w-37.5"
              onChange={(e) => {
                setStudentSort(
                  e.target.value as TDepartmentStudentSortEnumValue,
                );
              }}
            >
              <option value={DepartmentStudentSortEnum.ALL}>
                All Students
              </option>
              <option value={DepartmentStudentSortEnum.BLOCKED}>
                Blocked Only
              </option>
              <option value={DepartmentStudentSortEnum.ACTIVE}>
                Active Only
              </option>
              <option value={DepartmentStudentSortEnum.FACEAUTHENABLED}>
                Face Auth Enabled
              </option>
            </select>
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400">
            <Search size={20} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* List Section */}
      <div className="space-y-6">
        {students.map((student) => (
          <div
            key={student.email}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6"
          >
            {/* Image */}
            <div className="w-full md:w-48 h-48 shrink-0">
              {student.image ? (
                <Image
                  src={student.image}
                  alt={getFullName(student)}
                  className="w-full h-full object-cover rounded-xl shadow-inner"
                  width={200}
                  height={200}
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-400">
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {getFullName(student)}
                </h2>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {student.emailVerified && (
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-semibold">
                      ✓ Email Verified
                    </span>
                  )}
                  {student.faceAuthEnabled && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold">
                      Face Auth Enabled
                    </span>
                  )}
                  {student.isBlocked && (
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-semibold">
                      Blocked
                    </span>
                  )}
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-xs font-semibold">
                    {student.sex}
                  </span>
                </div>
              </div>

              <p className="text-gray-500 text-sm">
                DOB: {formatDate(student.dob)} | Joined:{" "}
                {formatDate(student.createdAt)}
              </p>
            </div>

            {/* Contact & Actions */}
            <div className="md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-700 text-sm">
                    <Phone size={18} />
                    <span>{student.phoneContact || "No phone"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <Mail size={18} />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-700 text-sm bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                    <Award size={18} className="text-orange-400" />
                    <span className="text-orange-700 font-medium">Student</span>
                  </div>
                  <div className="relative group">
                    <button className="text-gray-400 p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal size={20} />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
                      <button
                        onClick={() => openEmailModal(student)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Send size={16} /> Send Email
                      </button>
                      {!student.isBlocked ? (
                        <button
                          onClick={() => openBlockModal(student)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <UserX size={16} /> Block Student
                        </button>
                      ) : (
                        <button
                          onClick={() => openUnblockModal(student)}
                          className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                        >
                          <UserCheck size={16} /> Unblock Student
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && !loading && <EmptyState title="No Students" />}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={handlePreviousPage}
          disabled={!hasPreviousPage || loading}
          className="p-2 rounded-full border border-gray-300 disabled:opacity-30 hover:bg-white transition"
        >
          <ChevronLeft />
        </button>

        <span className="font-medium text-gray-600">
          Page {currentPage}
          {loading && (
            <span className="text-xs text-blue-500 ml-2">(Loading...)</span>
          )}
        </span>

        <button
          onClick={handleNextPage}
          disabled={!hasNextPage || loading}
          className="p-2 rounded-full border border-gray-300 hover:bg-white transition"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Modals */}
      <BlockStudentModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onConfirm={handleBlockStudent}
        studentName={selectedStudent ? getFullName(selectedStudent) : ""}
        studentEmail={selectedStudent?.email || ""}
      />

      <UnblockStudentModal
        isOpen={unblockModalOpen}
        onClose={() => setUnblockModalOpen(false)}
        onConfirm={handleUnblockStudent}
        studentName={selectedStudent ? getFullName(selectedStudent) : ""}
        studentEmail={selectedStudent?.email || ""}
      />

      <SendEmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onConfirm={handleSendEmail}
        studentName={selectedStudent ? getFullName(selectedStudent) : ""}
        studentEmail={selectedStudent?.email || ""}
      />
    </div>
  );
}
