"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Building2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import CreateUpdateInstitutionModal from "./CreateUpdateInstitutionModal/CreateUpdateInstitutionModal";
import DeleteInstitutionModal from "./DeleteInstitutionModal/DeleteInstitutionModal";
import DepartmentsModal from "./DepartmentsModal/DepartmentsModal";
import {
  IGetInstitutionApiResponse,
  IInstitution,
  IInstitutionsClientProps,
} from "./interface";
import { IMeta } from "../RolesPermissions/interface";

export default function InstitutionsClient({
  initialInstitutions,
  initialMeta,
}: IInstitutionsClientProps) {
  const [institutions, setInstitutions] =
    useState<IInstitution[]>(initialInstitutions);
  const [meta, setMeta] = useState<IMeta>(initialMeta);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [searchName, setSearchName] = useState("");
  const [includeDepartments, setIncludeDepartments] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("TERTIARY");
  const [selectedStatus, setSelectedStatus] = useState("ACTIVE");

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  const [selectedInstitution, setSelectedInstitution] =
    useState<IInstitution | null>(null);

  const fetchInstitutions = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: meta.limit.toString(),
        includeDetails: "true",
        includeDepartments: includeDepartments.toString(),
        ...(searchName && { name: searchName }),
        ...(selectedLevel && { institutionLevel: selectedLevel }),
        ...(selectedStatus && { status: selectedStatus }),
      });

      const res = await fetch(`/api/v1/institutions?${params.toString()}`);
      const result: IGetInstitutionApiResponse<IInstitution[]> =
        await res.json();

      if (result.success) {
        setInstitutions(result.data);
        if (result.meta) setMeta(result.meta);
      }
    } catch (err) {
      console.error("Failed to fetch institutions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInstitutions(1);
  };

  const handleOpenCreate = () => {
    setSelectedInstitution(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (inst: IInstitution) => {
    setSelectedInstitution(inst);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (inst: IInstitution) => {
    setSelectedInstitution(inst);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDepartments = (inst: IInstitution) => {
    setSelectedInstitution(inst);
    setIsDeptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">
            Institutions Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage all registered academic institutions and their details.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Institution
        </button>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select Level
          </option>
          <option value="TERTIARY">Tertiary</option>
          <option value="SECONDARY">Secondary</option>
          <option value="PRIMARY">Primary</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select Status
          </option>
          <option value="SUSPENDED">SUSPENDED</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="ACTIVE">ACTIVE</option>
        </select>

        <div className="flex items-center gap-2 px-2">
          <input
            type="checkbox"
            id="includeDept"
            checked={includeDepartments}
            onChange={(e) => setIncludeDepartments(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="includeDept"
            className="text-sm text-slate-700 font-medium"
          >
            Include Departments
          </label>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" /> Filter
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-blue-50/50 text-blue-900 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-4">Name & Code</th>
                <th className="p-4">Level</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Loading institutions...
                  </td>
                </tr>
              ) : institutions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No institutions found.
                  </td>
                </tr>
              ) : (
                institutions.map((inst) => (
                  <tr
                    key={inst.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">
                        {inst.name}
                      </div>
                      <div className="text-xs text-blue-600 font-mono">
                        {inst.code}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {inst.institutionLevel}
                    </td>
                    <td className="p-4 text-slate-600">
                      {inst.city}, {inst.state}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inst.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {inst.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDepartments(inst)}
                        disabled={!includeDepartments}
                        className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-medium transition-colors disabled:opacity-40"
                        title={
                          !includeDepartments
                            ? "Fetch departments using filter to view"
                            : "View Departments"
                        }
                      >
                        <Building2 className="w-3.5 h-3.5 mr-1" />
                        Depts ({inst.departments?.length || 0})
                      </button>
                      <button
                        onClick={() => handleOpenEdit(inst)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(inst)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-500">
            Page {meta.page} of {meta.totalPages} ({meta.totalItems} items
            total)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchInstitutions(meta.page - 1)}
              disabled={!meta.hasPreviousPage || loading}
              className="p-2 border border-slate-300 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchInstitutions(meta.page + 1)}
              disabled={!meta.hasNextPage || loading}
              className="p-2 border border-slate-300 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isFormModalOpen && (
        <CreateUpdateInstitutionModal
          isOpen={isFormModalOpen}
          initialData={selectedInstitution}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={() => {
            setIsFormModalOpen(false);
            fetchInstitutions(meta.page);
          }}
        />
      )}

      {isDeleteModalOpen && selectedInstitution && (
        <DeleteInstitutionModal
          isOpen={isDeleteModalOpen}
          institutionId={selectedInstitution.id}
          institutionName={selectedInstitution.name}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={() => {
            setIsDeleteModalOpen(false);
            fetchInstitutions(meta.page);
          }}
        />
      )}

      {isDeptModalOpen && selectedInstitution && (
        <DepartmentsModal
          isOpen={isDeptModalOpen}
          institutionName={selectedInstitution.name}
          departments={selectedInstitution.departments || []}
          onClose={() => setIsDeptModalOpen(false)}
        />
      )}
    </div>
  );
}
