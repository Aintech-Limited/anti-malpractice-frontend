"use client";

import { Trash2 } from "lucide-react";
import { IDeleteAccountModalProps } from "./interface";
import PINInput from "../PINInput/PINInput";

export default function DeleteAccountModal({
  account,
  pin,
  loading,
  onPinChange,
  onConfirm,
  onCancel,
}: IDeleteAccountModalProps) {
  if (!account) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 transform transition-all animate-slideUp">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Delete Account</h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete the account{" "}
            <strong>{account.accountName}</strong> ({account.accountNumber})?
          </p>
          <PINInput
            value={pin}
            onChange={onPinChange}
            label="Enter your 4-digit PIN to confirm"
            showToggle={true}
          />
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
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
