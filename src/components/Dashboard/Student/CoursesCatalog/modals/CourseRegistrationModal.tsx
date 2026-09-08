"use client";

import { useEffect, useCallback } from "react";
import { X, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { ICourseRegistrationModalProps } from "./interface";
import useStopDialogBGPageScrolling from "@/src/lib/hooks/useStopDialogBGPageScrolling";

export const CourseRegistrationModal = ({
  onClose,
  onConfirm,
  courseTitle,
  isOpen,
}: ICourseRegistrationModalProps) => {
  useStopDialogBGPageScrolling({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Course Registration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              You are about to register for:
            </p>
            <h4 className="text-xl font-bold text-gray-900 leading-snug">
              {courseTitle}
            </h4>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200/60 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              Please review your selection. Once confirmed, this course will be
              added to your active dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirm Registration
          </button>
        </div>
      </div>
    </div>
  );
};
