"use client";

import {
  Calendar,
  Clock,
  DollarSign,
  MoreVertical,
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  View,
} from "lucide-react";
import {
  getExamStatus,
  getExamType,
  formatDuration,
} from "../utils/examHelpers";
import { useState } from "react";
import { IExamCardProps } from "./interface";
import { formatDate } from "@/src/lib/helper";
import { AdminExamStatusTypeEnum, ProtectedRouteEnum } from "@/src/lib/enums";
import { useRouter } from "next/navigation";

export const ExamCard = ({
  exam,
  onViewQuestions,
  onAddQuestions,
  onUpdate,
  onDelete,
  onViewRegistrations,
}: IExamCardProps) => {
  const router = useRouter();
  const status = getExamStatus(exam.status);
  const type = getExamType(exam.type_);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300  group">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} border ${status.borderColor}`}
              >
                {status.label}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${type.color}`}
              >
                {type.label}
              </span>
              {exam.published && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Published
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {exam.title}
            </h3>
            {exam.course && (
              <p className="text-sm text-gray-500 mb-3">
                {exam.course.courseCode} - {exam.course.title}
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(exam.startTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(exam.durationMinutes)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>₦{exam.fee.toLocaleString()}</span>
              </div>
              <div className="text-gray-600">
                <span className="font-medium">{exam.totalMarks}</span> marks
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 animate-slideDown">
                <button
                  onClick={() => {
                    onViewQuestions(exam);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                >
                  <Eye className="w-4 h-4" />
                  View Questions
                </button>
                <button
                  onClick={() => {
                    onAddQuestions(exam);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Questions
                </button>
                <button
                  onClick={() => {
                    onUpdate(exam);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit Exam
                </button>
                <button
                  onClick={() => {
                    onDelete(exam);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Exam
                </button>
                {exam.adminStatus === AdminExamStatusTypeEnum.APPROVED && (
                  <button
                    onClick={() => {
                      onViewRegistrations(exam);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-red-50 rounded-b-lg"
                  >
                    <View className="w-4 h-4" />
                    View Registrations
                  </button>
                )}

                {exam.adminStatus === AdminExamStatusTypeEnum.APPROVED && (
                  <button
                    onClick={() => {
                      router.push(
                        ProtectedRouteEnum.LECTURERS +
                          `/grade-exams/${exam.id}`,
                      );
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-red-50 rounded-b-lg"
                  >
                    <View className="w-4 h-4" />
                    Grade Exam
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
