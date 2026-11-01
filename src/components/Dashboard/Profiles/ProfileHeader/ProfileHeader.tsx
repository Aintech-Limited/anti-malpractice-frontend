"use client";

import { Edit2, Save, X } from "lucide-react";
import { IProfileHeaderProps } from "./interface";
import { useRouter } from "next/navigation";
import { ProtectedRouteEnum, UserRoleTypeEnum } from "@/src/lib/enums";
import { useAuth } from "@/src/providers/auth/AuthContext";

export const ProfileHeader = ({
  isEditing,
  loading,
  onEdit,
  onCancel,
  onSave,
}: IProfileHeaderProps) => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full min-w-0">
      <div className="min-w-0">
        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
          My Profile
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Manage your personal information
        </p>
      </div>

      {!isEditing ? (
        <div className="flex flex-wrap gap-2 items-center">
          {typeof user?.faceAuthEnabled === "boolean" &&
            !user?.faceAuthEnabled &&
            user?.role === UserRoleTypeEnum.STUDENT && (
              <button
                onClick={() =>
                  router.push(ProtectedRouteEnum.STUDENT_FACE_CAPTURE)
                }
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Face Capture?
              </button>
            )}

          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            <Edit2 className="w-4 h-4 shrink-0" />
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={onCancel}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <Save className="w-4 h-4 shrink-0" />
            )}
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
