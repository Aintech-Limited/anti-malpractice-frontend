"use client";

import Image from "next/image";
import {
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Eye,
  BookOpen,
  UserCheck,
} from "lucide-react";
import { ILecturerCardProps } from "./interface";

export default function LecturerCard({
  lecturer,
  onReviewDocuments,
  onAssignCourse,
  onManageAssignments,
}: ILecturerCardProps) {
  const getFullName = () => `${lecturer.firstName} ${lecturer.lastName}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
      <div className="w-full md:w-48 h-48 shrink-0">
        {lecturer?.imageUrl ? (
          <Image
            src={lecturer.imageUrl}
            alt={getFullName()}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-xl shadow-inner"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-inner">
            <span className="text-4xl font-bold text-indigo-400">
              {lecturer.firstName[0]}
              {lecturer.lastName[0]}
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900">{getFullName()}</h2>

            {lecturer.isActive ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                <CheckCircle size={12} />
                Active
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                <XCircle size={12} />
                Inactive
              </span>
            )}
          </div>

          {/* Department Badge */}
          {lecturer?.roles?.map((role, idx) => {
            return (
              <div key={idx} className="flex gap-2 mt-3 flex-wrap">
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-semibold">
                  Department Name: {role.departmentName}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-semibold">
                  Course Code: {role.courseCode}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-semibold">
                  Course Role: {role.role}
                </span>
              </div>
            );
          })}
        </div>

        {/* Verification Status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">ID Verification:</span>
            {lecturer.idVerified ? (
              <span className="text-green-600 flex items-center gap-1 font-medium">
                <CheckCircle size={14} />
                Verified
              </span>
            ) : (
              <span className="text-yellow-600 flex items-center gap-1 font-medium">
                <XCircle size={14} />
                Pending
              </span>
            )}
          </div>

          {/* <div className="flex items-center gap-2 text-sm">
						<span className="text-gray-500">Selfie Verification:</span>
						{lecturer.selfieVerified ? (
							<span className="text-green-600 flex items-center gap-1 font-medium">
								<CheckCircle size={14} />
								Verified
							</span>
						) : (
							<span className="text-yellow-600 flex items-center gap-1 font-medium">
								<XCircle size={14} />
								Pending
							</span>
						)}
					</div> */}
        </div>

        <div className="text-xs text-gray-400">
          Joined: {new Date(lecturer.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Contact + Actions */}
      <div className="md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
        <div className="space-y-4">
          {lecturer.phoneNumber && (
            <div className="flex items-center gap-3 text-gray-700 text-sm">
              <Phone size={18} />
              <span>{lecturer.phoneNumber}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-gray-700 text-sm">
            <Mail size={18} />
            <span>{lecturer.email}</span>
          </div>

          {/* <div className="flex items-center justify-between">
						<div className="flex items-center gap-3 text-gray-700 text-sm bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
							<Building2 size={18} className="text-orange-400" />
							<span className="text-orange-700 font-medium">
								{lecturer.departmentName}
							</span>
						</div>

						<button className="text-gray-400 p-1 hover:bg-gray-100 rounded-lg">
							<MoreHorizontal size={20} />
						</button>
					</div> */}
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => onReviewDocuments(lecturer)}
            className="w-full py-3 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-100 transition flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            Review Docs
          </button>

          <button
            onClick={() => onAssignCourse(lecturer)}
            className="w-full py-3 bg-purple-50 text-purple-600 font-semibold rounded-xl hover:bg-purple-100 transition flex items-center justify-center gap-2"
          >
            <BookOpen size={16} />
            Assign Course
          </button>

          <button
            onClick={() => onManageAssignments(lecturer)}
            className="w-full py-3 bg-green-50 text-green-600 font-semibold rounded-xl hover:bg-green-100 transition flex items-center justify-center gap-2"
          >
            <UserCheck size={16} />
            View Assignments
          </button>
        </div>
      </div>
    </div>
  );
}
