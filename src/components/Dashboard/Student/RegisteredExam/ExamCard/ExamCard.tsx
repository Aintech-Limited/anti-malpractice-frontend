import {
  Calendar,
  BookOpen,
  Building2,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getRegistrationStatus, canMakePayment } from "../utils/examHelpers";
import { IExamCardProps } from "./interface";
import { formatDate } from "@/src/lib/helper";

export const ExamCard = ({ exam, onContinuePayment }: IExamCardProps) => {
  const status = getRegistrationStatus(exam.registrationStatus);
  const showPaymentButton = canMakePayment(exam.registrationStatus);

  const getStatusIcon = () => {
    switch (exam.registrationStatus) {
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4" />;
      case "REGISTERED":
        return <CheckCircle className="w-4 h-4" />;
      case "FAILED":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            {/* Status Badge */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color} border ${status.borderColor}`}
              >
                {getStatusIcon()}
                {status.label}
              </span>
            </div>

            {/* Exam Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {exam.exam.title}
            </h3>

            {/* Course Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {exam.course.courseCode}
              </span>
              {exam.course.department && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {exam.course.department.name}
                </span>
              )}
            </div>

            {/* Exam Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Level</p>
                <p className="font-medium text-gray-800">{exam.level}</p>
              </div>
              <div>
                <p className="text-gray-500">Semester</p>
                <p className="font-medium text-gray-800">{exam.semester}</p>
              </div>
              <div>
                <p className="text-gray-500">Registered On</p>
                <p className="font-medium text-gray-800">
                  {formatDate(exam.registeredAt)}
                </p>
              </div>
            </div>

            {/* Exam Fee (if available) */}
            {exam.exam.fee && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Exam Fee:</span>
                  <span className="text-sm font-semibold text-indigo-600">
                    ₦{exam.exam.fee.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          {showPaymentButton && (
            <div className="shrink-0">
              <button
                onClick={() => onContinuePayment(exam)}
                className="w-full md:w-auto px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm"
              >
                <CreditCard className="w-4 h-4" />
                Complete Payment
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Complete your payment to confirm registration
              </p>
            </div>
          )}

          {exam.registrationStatus === "REGISTERED" && (
            <div className="shrink-0">
              <div className="px-6 py-2.5 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Registration Confirmed</span>
              </div>
            </div>
          )}

          {exam.registrationStatus === "FAILED" && (
            <div className="shrink-0">
              <div className="px-6 py-2.5 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <span className="font-medium">Payment Failed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
