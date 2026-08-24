"use client";

import { useEffect, useState } from "react";
import { X, Building2 } from "lucide-react";
import { IAddDepartmentModalProps, TInstitution } from "./interface";
import LoadingOverlay from "@/src/components/common/LoadingOverlay/LoadingOverlay";
import { toast } from "react-toastify";
import { IGetInstitutionsResponse } from "@/src/components/SignUp/SignupForm/interface";

export default function AddDepartmentModal({
  isOpen,
  onClose,
  onConfirm,
}: IAddDepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    activeSemester: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInstitution, setSelectedInstitution] =
    useState<null | TInstitution>(null);
  const [institutions, setInstitutions] = useState<TInstitution[]>([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingInstitutions(true);

    const getInstitutions = async () => {
      try {
        const response = await fetch(
          `/api/v1/institutions?page=1&limit=100&includeDetails=false&institutionLevel=TERTIARY&includeDepartments=false`,
        );

        const data: IGetInstitutionsResponse = await response.json();

        if (data.success) {
          const institutions = data.data;
          setInstitutions(institutions);
        }
      } catch (error) {
        //
      } finally {
        setLoadingInstitutions(false);
      }
    };

    getInstitutions();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.activeSemester ||
      !selectedInstitution
    ) {
      toast.info("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    await onConfirm({
      ...formData,
      activeSemester: formData.activeSemester,
      institutionId: selectedInstitution.id,
    });
    setIsLoading(false);
    onClose();
    setFormData({
      name: "",
      description: "",
      activeSemester: "",
      imageUrl: "",
    });
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-md bg-black/50" />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Add New Department
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Computer Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Institution *
              </label>
              <select
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black"
                onChange={(e) => {
                  setSelectedInstitution(
                    institutions.find((ins) => ins.id === e.target.value) ??
                      null,
                  );
                }}
                required
                name="institution"
                value={selectedInstitution?.name ?? ""}
              >
                <option value="" disabled>
                  Select Institution
                </option>
                {Object.values(institutions).map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
              {loadingInstitutions && (
                <LoadingOverlay message={`Fetching Institutions`} />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Department description..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Active Semester *
              </label>
              <input
                type="text"
                value={formData.activeSemester}
                onChange={(e) =>
                  setFormData({ ...formData, activeSemester: e.target.value })
                }
                placeholder="e.g., Fall 2024 or 1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Department"}
          </button>
        </div>
      </div>
    </div>
  );
}
