"use client";

import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  BookOpen,
  DollarSign,
  FileText,
  Award,
  AlertCircle,
} from "lucide-react";
import { IAdminExamDetailsModalProps } from "./interface";
import { IAdminExamFullDetails } from "../interface";
import { formatDate } from "@/src/lib/helper";

export default function AdminExamDetailsModal({
  isOpen,
  onClose,
  exam,
  onFetchDetails,
}: IAdminExamDetailsModalProps) {
  const [details, setDetails] = useState<IAdminExamFullDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      if (!exam) return;
      setLoading(true);
      setError(null);
      const result = await onFetchDetails(exam.id);
      if (result) {
        setDetails(result);
      } else {
        setError("Failed to load exam details");
      }
      setLoading(false);
    };
    if (isOpen && exam) {
      loadDetails();
    }
  }, [isOpen, exam]);

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
              <h2 className="text-xl font-bold text-white">Exam Details</h2>
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
            <div className="text-center py-8">Loading exam details...</div>
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

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Schedule
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-500">Start:</span>{" "}
                        {formatDate(exam.startTime)}
                      </p>
                      <p>
                        <span className="text-gray-500">End:</span>{" "}
                        {formatDate(exam.endTime)}
                      </p>
                      <p>
                        <span className="text-gray-500">
                          Registration Deadline:
                        </span>{" "}
                        {formatDate(exam.registrationDeadline)}
                      </p>
                      <p>
                        <span className="text-gray-500">Duration:</span>{" "}
                        {exam.durationMinutes} minutes
                      </p>
                      {exam.resultDate && (
                        <p>
                          <span className="text-gray-500">Result Date:</span>{" "}
                          {formatDate(exam.resultDate)}
                        </p>
                      )}
                    </div>
                  </div>

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

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Award size={16} />
                      Marks & Assessment
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-500">Total Marks:</span>{" "}
                        {exam.totalMarks}
                      </p>
                      <p>
                        <span className="text-gray-500">Used Marks:</span>{" "}
                        {exam.usedMarks}
                      </p>
                      <p>
                        <span className="text-gray-500">Question Count:</span>{" "}
                        {exam.questionCount}
                      </p>
                      <p>
                        <span className="text-gray-500">MCQ Marks:</span>{" "}
                        {exam.mcqMarks}
                      </p>
                      {exam.mcqDurationMinutes && (
                        <p>
                          <span className="text-gray-500">MCQ Duration:</span>{" "}
                          {exam.mcqDurationMinutes} minutes
                        </p>
                      )}
                      {exam.shortMarks && (
                        <p>
                          <span className="text-gray-500">
                            Short Questions Marks:
                          </span>{" "}
                          {exam.shortMarks}
                        </p>
                      )}
                      {exam.shortDurationMinutes && (
                        <p>
                          <span className="text-gray-500">
                            Short Questions Duration:
                          </span>{" "}
                          {exam.shortDurationMinutes} minutes
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign size={16} />
                      Fee & Publication
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-500">Exam Fee:</span> $
                        {exam.fee}
                      </p>
                      <p>
                        <span className="text-gray-500">Published:</span>{" "}
                        {exam.published ? "Yes" : "No"}
                      </p>
                      {details?.passingScore && (
                        <p>
                          <span className="text-gray-500">Passing Score:</span>{" "}
                          {details.passingScore}%
                        </p>
                      )}
                      {details?.allowRetake && (
                        <p>
                          <span className="text-gray-500">Allow Retake:</span>{" "}
                          Yes{" "}
                          {details.retakeFee ? `($${details.retakeFee})` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {details?.instructions && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    Instructions
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                    {details.instructions}
                  </div>
                </div>
              )}

              {/* Questions Preview */}
              {details?.questions && details.questions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    Questions Preview (First 5)
                  </h4>
                  <div className="space-y-3">
                    {details.questions
                      .slice(0, 5)
                      .map((q: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">
                            {idx + 1}. {q.text}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Type: {q.type} | Marks: {q.marks}
                          </p>
                        </div>
                      ))}
                    {details.questions.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        ... and {details.questions.length - 5} more questions
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Admin Status
                </h4>
                <div className="space-y-2">
                  <p>
                    <span className="text-gray-500">Status:</span>{" "}
                    {exam.adminStatus.replace("_", " ")}
                  </p>
                  {exam.requestedChanges && (
                    <p>
                      <span className="text-gray-500">Requested Changes:</span>{" "}
                      <span className="text-red-600">
                        {exam.requestedChanges}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
