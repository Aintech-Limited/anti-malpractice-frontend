"use client";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import Image from "next/image";
import { IEditMaterialModalProps } from "./interface";
import { IUpdateMaterialPayload } from "../interface";

export const EditMaterialModal = ({
  material,
  onClose,
  onSuccess,
}: IEditMaterialModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<IUpdateMaterialPayload>({
    title: material.title,
    description: material.description,
    price: parseFloat(material.price),
    isFree: material.isFree,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/v1/course-materials/${material.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess({
          ...material,
          ...formData,
          price: formData.price?.toString() ?? material.price,
        });
      } else {
        setError(data.message || "Failed to update material");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Edit Material</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Current Cover Preview */}
          {material.MaterialCover && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Cover
              </label>
              <Image
                src={material.MaterialCover}
                alt={material.title}
                width={200}
                height={150}
                className="rounded-lg object-cover"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFree"
                checked={formData.isFree}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isFree: e.target.checked,
                    price: e.target.checked ? 0 : formData.price,
                  })
                }
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="isFree"
                className="text-sm font-medium text-gray-700"
              >
                Make this material free
              </label>
            </div>

            {!formData.isFree && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₦) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}
          </div>

          {/* Read-only Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">File Type:</span>{" "}
              {material.fileType}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">File Size:</span>{" "}
              {(material.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Downloads:</span>{" "}
              {material.downloadCount.toLocaleString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Average Rating:</span>{" "}
              {material.averageRating.toFixed(1)} ({material.ratingCount}{" "}
              ratings)
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
