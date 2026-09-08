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
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-gray-600 mt-2">Manage your personal information</p>
      </div>

      {!isEditing ? (
        <div className="flex gap-2">
          {typeof user?.faceAuthEnabled === "boolean" &&
            !user?.faceAuthEnabled &&
            user?.role === UserRoleTypeEnum.STUDENT && (
              <button
                onClick={() =>
                  router.push(ProtectedRouteEnum.STUDENT_FACE_CAPTURE)
                }
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Face Capture?
              </button>
            )}

          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
