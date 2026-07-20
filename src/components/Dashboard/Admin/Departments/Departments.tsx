"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Calendar,
  Building2,
} from "lucide-react";
import {
  ICreateDepartmentData,
  IDepartment,
  IDepartmentsClientProps,
  IDepartmentsResponse,
  IUpdateDepartmentData,
} from "./interface";
import DeleteDepartmentModal from "./DeleteDepartmentModal/DeleteDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal/EditDepartmentModal";
import AddDepartmentModal from "./AddDepartmentModal/AddDepartmentModal";
import { toast } from "react-toastify";
import { ProtectedRouteEnum } from "@/src/lib/enums";
import { formatDate } from "@/src/lib/helper";

export default function DepartmentsClient({
  initialData,
  initialPage,
  limit,
}: IDepartmentsClientProps) {
  const router = useRouter();
  const [departments, setDepartments] = useState<IDepartment[]>(
    initialData.data ?? [],
  );
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasNextPage, setHasNextPage] = useState(initialData.meta.hasNextPage);
  const [hasPreviousPage, setHasPreviousPage] = useState(
    initialData.meta.hasPreviousPage,
  );
  const [filters, setFilters] = useState<{ isArchived?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<IDepartment | null>(null);

  const loadDepartments = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/v1/admin/departments?page=${page}&limit=${limit}&isArchived=${filters.isArchived}`,
        {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch departments: ${response.statusText}`);
      }

      const result: IDepartmentsResponse = await response.json();

      if (result.success) {
        setDepartments(result.data);
        setCurrentPage(result.meta.page);
        setHasNextPage(result.meta.hasNextPage);
        setHasPreviousPage(result.meta.hasPreviousPage);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch departments",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && !loading) {
      loadDepartments(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage && !loading) {
      loadDepartments(currentPage - 1);
    }
  };

  const handleCreateDepartment = async (data: ICreateDepartmentData) => {
    try {
      const response = await fetch("/api/v1/admin/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await loadDepartments(currentPage);
        toast.success("Department created successfully!");
      } else {
        toast.error(`Failed to create department: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating department:", error);
      toast.error("Failed to create department. Please try again.");
    }
  };

  const handleUpdateDepartment = async (
    id: string,
    data: Partial<IUpdateDepartmentData>,
  ) => {
    try {
      const response = await fetch(`/api/v1/admin/departments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await loadDepartments(currentPage);
        toast.success("Department updated successfully!");
      } else {
        toast.error(`Failed to update department: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Failed to update department. Please try again.");
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/admin/departments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        await loadDepartments(currentPage);
        toast.success("Department deleted successfully!");
      } else {
        toast.error(`Failed to delete department: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
          <div className="text-sm text-gray-500">
            ({departments.length} departments)
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
          >
            <Plus size={18} />
            Add New
          </button>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none text-gray-500"
              name="isArchived"
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  [e.target.name]:
                    e.target.value === "All"
                      ? undefined
                      : e.target.value === "Active"
                        ? false
                        : true,
                }));
              }}
            >
              <option value="All">All Departments</option>
              <option value="Active">Active</option>
              <option value="InActive">Inactive</option>
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
        {departments.map((department) => (
          <div
            key={department.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6"
          >
            {/* Image */}
            <div className="w-full md:w-48 h-48 shrink-0">
              {department.imageUrl ? (
                <Image
                  src={department.imageUrl}
                  alt={department.name}
                  className="w-full h-full object-cover rounded-xl shadow-inner"
                  width={200}
                  height={200}
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-blue-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {department.name}
                </h2>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <Calendar size={12} />
                    Semester: {department.activeSemester}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-xs font-semibold">
                    Created: {formatDate(department.createdAt)}
                  </span>
                </div>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed">
                {department.description}
              </p>

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <div className="p-2 bg-blue-500 flex items-center justify-center text-white text-xs">
                    Created By:
                  </div>
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    {department.admin.name[0]}
                  </div>
                  <span>{department.admin.name}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">
                  {department?.admin?.email ?? "N/A"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="md:w-72 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div className="space-y-3">
                <button
                  onClick={() =>
                    router.push(
                      ProtectedRouteEnum.ADMINS +
                        `/departments/${department.id}/students`,
                    )
                  }
                  className="w-full py-2.5 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2"
                >
                  <Users size={18} />
                  View Students
                </button>

                <button
                  onClick={() =>
                    router.push(
                      ProtectedRouteEnum.ADMINS +
                        `/departments/${department.id}/courses`,
                    )
                  }
                  className="w-full py-2.5 bg-green-50 text-green-600 font-semibold rounded-xl hover:bg-green-100 transition flex items-center justify-center gap-2"
                >
                  <BookOpen size={18} />
                  View Courses
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedDepartment(department);
                    setEditModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() => {
                    setSelectedDepartment(department);
                    setDeleteModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {departments.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No departments found</p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            Create your first department →
          </button>
        </div>
      )}

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
      <AddDepartmentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={handleCreateDepartment}
      />

      <EditDepartmentModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDepartment(null);
        }}
        onConfirm={handleUpdateDepartment}
        department={selectedDepartment}
      />

      <DeleteDepartmentModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDepartment(null);
        }}
        onConfirm={handleDeleteDepartment}
        department={selectedDepartment}
      />
    </div>
  );
}
