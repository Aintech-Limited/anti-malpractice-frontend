import { BookOpen, X, Calendar } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/src/lib/helper";
import { getCourseFromPayment } from "../utils/paymentHelpers";
import { ICourseModalProps } from "../interface";

export const CourseModal = ({ payment, onClose }: ICourseModalProps) => {
  const course = getCourseFromPayment(payment);

  if (!course) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 transform transition-all animate-slideUp">
        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">Course Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {payment.courseMaterial?.MaterialCover && (
            <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={payment.courseMaterial.MaterialCover}
                alt={course.title}
                className="w-full h-full object-cover"
                width={200}
                height={90}
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Course Code</p>
              <p className="text-lg font-semibold text-gray-800">
                {course.courseCode}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Course Title</p>
              <p className="text-lg text-gray-800">{course.title}</p>
            </div>
            {payment?.student && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Student INFO</p>
                <p className="text-lg text-green-600">
                  {payment?.student?.firstName ?? "N/A"}{" "}
                  {payment?.student?.lastName ?? "N/A"}
                </p>
              </div>
            )}

            {payment.courseMaterial && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Material Title</p>
                <p className="text-lg text-gray-800">
                  {payment.courseMaterial.title}
                </p>
              </div>
            )}

            {payment.examRegistration && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Semester</p>
                    <p className="text-gray-800">
                      Semester {payment.examRegistration.semester}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Level</p>
                    <p className="text-gray-800">
                      Level {payment.examRegistration.level}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Exam Title</p>
                    <p className="text-gray-800">
                      {payment.examRegistration.exam.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Exam Start Time
                    </p>
                    <p className="text-gray-800">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(payment.examRegistration.exam.startTime)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Exam End Time</p>
                    <p className="text-gray-800">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(payment.examRegistration.exam.endTime)}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Registration Status
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {payment?.examRegistration?.registrationStatus ??
                      "REGISTERED"}
                  </span>
                </div>
              </>
            )}

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Payment Reference</p>
              <p className="text-sm font-mono text-gray-600">{payment.id}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
