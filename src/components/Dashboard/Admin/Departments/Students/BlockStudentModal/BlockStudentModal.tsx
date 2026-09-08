"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { IBlockStudentModalProps } from "./interface";
import useStopDialogBGPageScrolling from "@/src/lib/hooks/useStopDialogBGPageScrolling";

export default function BlockStudentModal({
  isOpen,
  onClose,
  onConfirm,
  studentName,
  studentEmail,
}: IBlockStudentModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  useStopDialogBGPageScrolling({ isOpen, onClose });

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-md bg-black/50" />

      <div
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-red-600 to-red-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Block Student</h2>
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
            Are you sure you want to block <strong>{studentName}</strong>?
          </p>
          <p className="text-sm text-gray-500 mb-2">Email: {studentEmail}</p>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 mt-3">
            <p className="text-sm text-amber-800">
              ⚠️ Blocked students will not be able to:
            </p>
            <ul className="text-xs text-amber-700 mt-2 list-disc list-inside">
              <li>Access ongoing exams</li>
              <li>Submit answers</li>
              <li>Start new exams</li>
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
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? "Blocking..." : "Yes, Block Student"}
          </button>
        </div>
      </div>
    </div>
  );
}
