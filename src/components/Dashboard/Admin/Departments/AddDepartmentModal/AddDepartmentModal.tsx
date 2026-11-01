"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { X, Building2, UploadCloud, Trash2, CheckCircle2 } from "lucide-react";
import { IAddDepartmentModalProps, TInstitution } from "./interface";
import LoadingOverlay from "@/src/components/common/LoadingOverlay/LoadingOverlay";
import { toast } from "react-toastify";
import { IGetInstitutionsResponse } from "@/src/components/SignUp/SignupForm/interface";
import { ICreateDepartmentData } from "../interface";
import Image from "next/image";

export default function AddDepartmentModal({
  isOpen,
  onClose,
  onConfirm,
}: IAddDepartmentModalProps) {
  const [formData, setFormData] = useState<ICreateDepartmentData>({
    name: "",
    description: "",
    imageURL: "",
    institutionId: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInstitution, setSelectedInstitution] =
    useState<null | TInstitution>(null);
  const [institutions, setInstitutions] = useState<TInstitution[]>([]);
  const [loadingInstitutions, setLoadInstitutions] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoadInstitutions(true);

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
        // Handle error if needed
      } finally {
        setLoadInstitutions(false);
      }
    };

    getInstitutions();
  }, [isOpen]);

  // Clean up object URLs on unmount or file reset to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) return null;

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Reset imageURL until confirmed upload
      setFormData((prev) => ({ ...prev, imageURL: "" }));
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageURL: "" }));
  };

  const uploadImageFile = async () => {
    if (!imageFile) return;

    setIsUploadingImage(true);
    try {
      const data = new FormData();
      data.append("department", imageFile);

      const res = await fetch("/api/v1/uploads/department", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message ?? "Failed to upload image");
      }

      const result = await res.json();
      const uploadedUrl = result.url || result.data?.url || "";

      setFormData((prev) => ({ ...prev, imageURL: uploadedUrl }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleResetModal = () => {
    handleRemoveImage();
    setFormData({
      name: "",
      description: "",
      imageURL: "",
      institutionId: "",
    });
    setSelectedInstitution(null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !selectedInstitution) {
      toast.info("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      await onConfirm({
        ...formData,
        institutionId: selectedInstitution.id,
      });

      handleResetModal();
      onClose();
    } catch (error) {
      toast.error("An error occurred during submission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-md bg-black/50" />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden min-w-0">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full shrink-0">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Institution *
              </label>
              <div className="relative">
                <select
                  className="w-full pl-3 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black"
                  onChange={(e) => {
                    setSelectedInstitution(
                      institutions.find((ins) => ins.id === e.target.value) ??
                        null,
                    );
                  }}
                  required
                  name="institution"
                  value={selectedInstitution?.id ?? ""}
                >
                  <option value="" disabled>
                    Select Institution
                  </option>
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
              <LoadingOverlay
                message={`Fetching Institutions`}
                isOpen={loadingInstitutions}
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department Banner Image
              </label>

              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-2">
                    <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                      <Image
                        src={imagePreview}
                        alt="Department Preview"
                        className="w-full h-full object-cover"
                        width={500}
                        height={500}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-md"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {imageFile && (
                      <p className="text-xs text-gray-500 mt-2 px-1 truncate">
                        {imageFile.name} ({(imageFile.size / 1024).toFixed(1)}{" "}
                        KB)
                      </p>
                    )}
                  </div>

                  {formData.imageURL ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-semibold bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>Image uploaded and ready!</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={uploadImageFile}
                      disabled={isUploadingImage}
                      className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 text-sm"
                    >
                      {isUploadingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Uploading Image...</span>
                        </>
                      ) : (
                        <span>Confirm & Upload Image</span>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, WEBP (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              )}
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
            disabled={isLoading || isUploadingImage}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Department"}
          </button>
        </div>
      </div>
    </div>
  );
}
