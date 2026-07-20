"use client";

import { useState } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { IUnassignConfirmModalProps } from "./interface";

export default function UnassignConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  assignment,
}: IUnassignConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-md bg-black/50" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-linear-to-r from-red-600 to-red-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Unassign Lecturer
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

        <div className="px-6 py-5">
          <p className="text-gray-700 mb-4">
            Are you sure you want to unassign this lecturer from{" "}
            <strong>
              {assignment.course.courseCode} - {assignment.course.title}
            </strong>
            ?
          </p>

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <p className="text-sm text-amber-800 font-semibold mb-2">
              ⚠️ Warning:
            </p>
            <ul className="text-xs text-amber-700 list-disc list-inside space-y-1">
              <li>The lecturer will lose access to this course</li>
              <li>Any pending grades may need to be reassigned</li>
              <li>Students may be affected if this is the main lecturer</li>
            </ul>
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
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            {isLoading ? "Unassigning..." : "Yes, Unassign"}
          </button>
        </div>
      </div>
    </div>
  );
}
