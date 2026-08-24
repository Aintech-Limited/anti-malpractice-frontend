"use client";

import { Lock } from "lucide-react";
import PINInput from "../PINInput/PINInput";
import { ISetupPINModalProps } from "./interface";

export default function SetupPINModal({
  newPIN,
  confirmPIN,
  loading,
  onNewPINChange,
  onConfirmPINChange,
  onConfirm,
  onCancel,
}: ISetupPINModalProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 transform transition-all animate-slideUp">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-full">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Set Up Security PIN
            </h2>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Create a 4-digit PIN to secure your accounts
          </p>
        </div>

        <div className="p-6 space-y-6">
          <PINInput
            value={newPIN}
            onChange={onNewPINChange}
            label="New PIN"
            showToggle={true}
          />
          <PINInput
            value={confirmPIN}
            onChange={onConfirmPINChange}
            label="Confirm PIN"
            showToggle={true}
          />
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Later
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Set Up PIN"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
