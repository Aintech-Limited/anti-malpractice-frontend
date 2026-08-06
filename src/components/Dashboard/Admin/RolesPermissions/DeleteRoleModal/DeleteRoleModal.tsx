"use client";

import { Trash2 } from "lucide-react";
import { IDeleteRoleModalProps } from "./interface";

export const DeleteRoleModal = ({
  deleteTarget,
  handleDelete,
  setShowDeleteConfirm,
  error,
}: IDeleteRoleModalProps) => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowDeleteConfirm(false)}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        {error.network && <p className="text-red-600 mb-6">{error.network}</p>}

        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Delete Role
        </h3>
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete the role &quot;
          {deleteTarget?.name}&quot;? This action cannot be undone. Users
          assigned to this role may lose access.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            Delete Role
          </button>
        </div>
      </div>
    </div>
  );
};
