"use client";

import {
  X,
  AlertCircle,
  TicketPlusIcon,
  MessageCircleWarningIcon,
} from "lucide-react";
import { ICourseRegistrationModalProps } from "./interface";

export const CourseRegistrationModal = ({
  onClose,
  onConfirm,
  courseTitle,
  isOpen,
}: ICourseRegistrationModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-10 animate-fadeIn p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              You would be registered for this course.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-full">
            <MessageCircleWarningIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Register for {courseTitle}
          </h2>
        </div>

        <div className="border-b border-gray-200 p-6 flex justify-between items-center gap-6">
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-20 h-20" />
          </button>
          <button
            onClick={onConfirm}
            className="text-green-400 hover:text-green-600 transition-colors"
          >
            <TicketPlusIcon className="w-20 h-20" />
          </button>
        </div>
      </div>
    </div>
  );
};
