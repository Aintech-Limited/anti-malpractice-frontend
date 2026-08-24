"use client";

import { useState, useEffect } from "react";
import {
  X,
  Eye,
  ShoppingCart,
  AlertCircle,
  FileText,
  Video,
  File,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  IAvailableCourseMaterialsModalProps,
  IAvailableCourseMaterial,
  ICOurseMaterialPurchaseInitiateResponse,
} from "./interface";
import { toast } from "react-toastify";
import { formatFileSize } from "./utils/utils";
import MaterialListView from "./MaterialListView/MaterialListView";

const AvailableCourseMaterialsModal = ({
  isOpen,
  onClose,
  courseId,
  courseCode,
  courseTitle,
  onPurchaseComplete,
}: IAvailableCourseMaterialsModalProps) => {
  const router = useRouter();
  const [materials, setMaterials] = useState<IAvailableCourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] =
    useState<IAvailableCourseMaterial | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "preview">("list");

  // Fetch materials when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMaterials();
    }
  }, [isOpen, courseId]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/course-materials/${courseId}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to fetch materials");
      }

      console.log("data: ", data);
      setMaterials(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (material: IAvailableCourseMaterial) => {
    try {
      setPurchasingId(material.id);

      const response = await fetch(
        "/api/v1/purchase/initiate/course-materials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            merchandiseId: material.id,
            provider: "FLUTTERWAVE",
            merchandiseType: "COURSE_MATERIAL",
          }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        const data =
          (await response.json()) as ICOurseMaterialPurchaseInitiateResponse;
        if ([422, 400].includes(response.status)) {
          toast.error(data.message);
          throw new Error(data.message);
        }
        if (response.status === 409) {
          // Update material as purchased
          setMaterials((prev) =>
            prev.map((m) =>
              m.id === material.id ? { ...m, isPurchased: true } : m,
            ),
          );

          onPurchaseComplete?.();

          // If in preview mode, close preview and show success
          if (viewMode === "preview") {
            setViewMode("list");
            setSelectedMaterial(null);
          }
          return;
        }
        throw new Error("Purchase failed");
      }

      const data =
        (await response.json()) as ICOurseMaterialPurchaseInitiateResponse;
      if (data.success) {
        router.push(data.data.link);
        return;
      }
    } catch (err) {
      console.error("Purchase error:", err);
      toast.error("Failed to purchase material. Please try again.");
    } finally {
      setPurchasingId(null);
    }
  };

  const handleViewMaterial = (material: IAvailableCourseMaterial) => {
    if (material.isPurchased) {
      // Open PDF viewer or video player
      if (material.fileType === "pdf") {
        router.push(`/materials/view/${material.id}`);
      } else {
        window.open(material.fileURL, "_blank");
      }
    } else {
      // Show preview or purchase modal
      setSelectedMaterial(material);
      setViewMode("preview");
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "video":
        return <Video className="w-5 h-5 text-blue-500" />;
      case "image":
        return <ImageIcon className="w-5 h-5 text-green-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Course Materials
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {courseCode}: {courseTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading materials...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchMaterials}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : viewMode === "preview" && selectedMaterial ? (
            // Material Preview Mode
            <div className="space-y-6">
              <button
                onClick={() => {
                  setViewMode("list");
                  setSelectedMaterial(null);
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                ← Back to materials
              </button>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {getMaterialIcon(selectedMaterial.fileType)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedMaterial.title}
                    </h3>
                    {selectedMaterial.description && (
                      <p className="text-gray-600 mt-2">
                        {selectedMaterial.description}
                      </p>
                    )}
                    <div className="mt-4 space-y-2 text-sm text-gray-500">
                      {selectedMaterial.size && (
                        <p>
                          Size:{" "}
                          {formatFileSize(parseInt(selectedMaterial.size))}
                        </p>
                      )}
                      {selectedMaterial.duration && (
                        <p>Duration: {selectedMaterial.duration}</p>
                      )}
                      <p>
                        Uploaded:{" "}
                        {selectedMaterial.uploadedAt
                          ? new Date(
                              selectedMaterial.uploadedAt,
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p>
                        Lecturer: {selectedMaterial.uploadedBy.firstName}{" "}
                        {selectedMaterial.uploadedBy.lastName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                {selectedMaterial.fileType === "pdf" &&
                  selectedMaterial.fileURL && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Preview
                      </h4>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm text-gray-600">
                            Preview of first 3 pages available
                          </p>
                          {!selectedMaterial.isPurchased && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                              Purchase to view full content
                            </span>
                          )}
                        </div>
                        <div className="aspect-3/4 bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500 text-sm">
                            Preview not available
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Purchase/Action Button */}
                {!selectedMaterial.isPurchased ? (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800">
                        Purchase this material to access the full content
                      </p>
                      {selectedMaterial.price && (
                        <p className="text-lg font-semibold text-blue-900 mt-2">
                          ${Number(selectedMaterial.price).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handlePurchase(selectedMaterial)}
                      disabled={purchasingId === selectedMaterial.id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {purchasingId === selectedMaterial.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Purchase for $
                          {Number(selectedMaterial.price)?.toFixed(2) || "0.00"}
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleViewMaterial(selectedMaterial)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Material
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Materials List View
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.map((material) => (
                  <MaterialListView
                    material={material}
                    getMaterialIcon={getMaterialIcon}
                    onPurchase={(material: IAvailableCourseMaterial) =>
                      handlePurchase(material)
                    }
                    onSelectMaterial={(
                      material: IAvailableCourseMaterial | null,
                    ) => setSelectedMaterial(material)}
                    onSetViewMode={(mode) => setViewMode(mode)}
                    onViewMaterial={(material: IAvailableCourseMaterial) =>
                      handleViewMaterial(material)
                    }
                    purchasingId={purchasingId}
                    key={material.id}
                  />
                ))}
              </div>

              {materials.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No materials available
                  </h3>
                  <p className="text-gray-500">
                    Materials will appear here once they are added to the
                    course.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {materials.length} material{materials.length !== 1 ? "s" : ""}{" "}
              available
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableCourseMaterialsModal;
