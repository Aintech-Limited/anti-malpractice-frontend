import { User, Calendar, BookOpen, Building2, Award } from "lucide-react";
import {
  getRegistrationStatus,
  getStudentFullName,
} from "../utils/registrationHelpers";
import { IRegistrationCardProps } from "./interface";
import { formatDate } from "@/src/lib/helper";

export const RegistrationCard = ({
  registration,
  index,
}: IRegistrationCardProps) => {
  const status = getRegistrationStatus(registration.registrationStatus);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-sm font-medium text-gray-400">
                #{index + 1}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} border ${status.borderColor}`}
              >
                {status.label}
              </span>
            </div>

            {/* Student Info */}
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {getStudentFullName(registration)}
                </h3>
                <p className="text-sm text-gray-500">
                  {registration.student.email || "No email provided"}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="w-4 h-4" />
                <span>Level {registration.level}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>Semester {registration.semester}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(registration.registeredAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{registration.course.courseCode}</span>
              </div>
            </div>

            {/* Course & Department Info */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Course:</span>{" "}
                {registration.course.courseCode}
                {registration.course.department && (
                  <span className="ml-2">
                    • <span className="font-medium">Dept:</span>{" "}
                    {registration.course.department.name}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
