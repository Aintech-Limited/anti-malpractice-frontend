"use client";

import { useState } from "react";
import {
  X,
  BookOpen,
  FileText,
  AlertCircle,
  MessageCircleWarningIcon,
} from "lucide-react";
import { IAdminGradeExamModalProps } from "./interface";
import { formatDate } from "@/src/lib/helper";
import { toast } from "react-toastify";

export default function AdminGradeExamModal({
  isOpen,
  onClose,
  exam,
  ongradeExam,
}: IAdminGradeExamModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gradeResults = async (examId: string) => {
    setLoading(true);
    const result = await ongradeExam(examId);
    setLoading(false);
    if (result?.success) {
      toast.success(result.message);
      onClose();
      return;
    }

    toast.error(result?.message || "Failed to grade examresults");
    setError("Failed to grade exam");
  };

  if (!isOpen || !exam) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-md bg-black/50" />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-linear-to-r from-indigo-600 to-indigo-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Grade Exam ?</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">Grading Exam results...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {exam.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                    {exam.course.courseCode}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                    {exam.type_}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-extrabold text-gray-700 mb-2 flex items-center gap-2 animate-pulse">
                      <MessageCircleWarningIcon size={30} color="red" />
                      Performing this action would grade this Exam if the
                      assigned lecturer is done grading!
                    </h4>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BookOpen size={16} />
                      Course Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-500">Course:</span>{" "}
                        {exam.course.title}
                      </p>
                      <p>
                        <span className="text-gray-500">Department:</span>{" "}
                        {exam.course.department.name}
                      </p>
                      <p>
                        <span className="text-gray-500">Created By:</span>{" "}
                        {`${exam.lecturer.firstName} ${exam.lecturer.lastName ?? ""}`}{" "}
                        ({exam.lecturer.email})
                      </p>
                      <p>
                        <span className="text-gray-500">Created At:</span>{" "}
                        {formatDate(exam.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Admin Status
                </h4>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-evenly">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition cursor-pointer"
            disabled={loading}
          >
            Close
          </button>
          <button
            onClick={() => gradeResults(exam.id)}
            className="px-6 py-2 bg-green-200 hover:bg-green-300 text-green-800 font-semibold rounded-xl transition cursor-pointer"
            disabled={loading}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
