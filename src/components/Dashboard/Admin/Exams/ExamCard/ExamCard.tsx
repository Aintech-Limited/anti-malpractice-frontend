"use client";

import {
  Calendar,
  Clock,
  BookOpen,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ThumbsUp,
  Edit,
} from "lucide-react";
import { IAdminExamCardProps } from "./interface";
import {
  adminExamCardstatusColors,
  adminExamCardTypeColors,
} from "../constants/constants";
import { formatDate } from "@/src/lib/helper";

export default function AdminExamCard({
  exam,
  onViewDetails,
  onApprove,
  onRequestChanges,
  onGradeExam,
  onReleaseResult,
}: IAdminExamCardProps) {
  const status = adminExamCardstatusColors[exam.adminStatus];
  const now = new Date();
  const isExamEnded = now > new Date(exam.endTime);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h2 className="text-xl font-bold text-gray-900">{exam.title}</h2>
            <span
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${status.bg} ${status.text}`}
            >
              {status.id === 1 ? (
                <CheckCircle size={14} className="text-green-600" />
              ) : status.id === 2 ? (
                <AlertCircle size={14} className="text-yellow-600" />
              ) : (
                <XCircle size={14} className="text-red-600" />
              )}
              {exam.adminStatus.replace("_", " ")}
            </span>
            <span
              className={`px-2 py-1 rounded-lg text-xs font-semibold ${adminExamCardTypeColors[exam.type_]}`}
            >
              {exam.type_}
            </span>
            {exam.published && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-semibold">
                Published
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>
                {exam.course.courseCode} - {exam.course.title}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(exam.startTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{exam.durationMinutes} mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Total Marks</p>
          <p className="font-semibold text-gray-900">{exam.totalMarks}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">MCQ Marks</p>
          <p className="font-semibold text-gray-900">{exam.mcqMarks}</p>
        </div>
        {exam.shortMarks && (
          <div>
            <p className="text-xs text-gray-500">Short Questions</p>
            <p className="font-semibold text-gray-900">
              {exam.shortMarks} marks
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500">Fee</p>
          <p className="font-semibold text-gray-900 flex items-center gap-1">
            <DollarSign size={12} />
            {exam.fee}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Created by: {exam.lecturer.firstName} {exam.lecturer?.lastName ?? ""}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onViewDetails(exam)}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
          >
            <Eye size={16} />
            View Details
          </button>

          {exam.adminStatus !== "APPROVED" && (
            <button
              onClick={() => onApprove(exam)}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition flex items-center gap-2"
            >
              <ThumbsUp size={16} />
              Approve
            </button>
          )}

          {exam.adminStatus !== "CHANGES_REQUESTED" &&
            exam.adminStatus !== "APPROVED" && (
              <button
                onClick={() => onRequestChanges(exam)}
                className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-xl hover:bg-yellow-700 transition flex items-center gap-2"
              >
                <Edit size={16} />
                Request Changes
              </button>
            )}

          {!exam.isGraded &&
            !exam.isReleased &&
            exam.adminStatus === "APPROVED" &&
            isExamEnded && (
              <button
                onClick={() => onGradeExam(exam)}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Edit size={16} />
                Grade Exam
              </button>
            )}

          {exam.isGraded &&
            !exam.isReleased &&
            exam.adminStatus === "APPROVED" &&
            isExamEnded && (
              <button
                onClick={() => onReleaseResult(exam)}
                className="px-4 py-2 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition flex items-center gap-2"
              >
                <Edit size={16} />
                Release Result
              </button>
            )}
        </div>
      </div>

      {exam.requestedChanges && exam.adminStatus === "CHANGES_REQUESTED" && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-xs text-red-600 font-semibold mb-1">
            Changes Requested:
          </p>
          <p className="text-sm text-red-700">{exam.requestedChanges}</p>
        </div>
      )}
    </div>
  );
}
