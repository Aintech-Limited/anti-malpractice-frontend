"use client";

import { CircleAlert } from "lucide-react";
import { ISetDefaultAccountModalProps } from "../interface";

export default function SetDefaultAccountModal({
  account,
  loading,
  onConfirm,
  onCancel,
}: ISetDefaultAccountModalProps) {
  if (!account) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 transform transition-all animate-slideUp">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <CircleAlert className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Set Account as new Default
            </h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to set account as the new default{" "}
            <strong>{account.accountName}</strong> ({account.accountNumber})?
          </p>
          <p className="text-gray-600 mb-4">
            If when successful, all further payments would be settled on this
            Account!
          </p>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
