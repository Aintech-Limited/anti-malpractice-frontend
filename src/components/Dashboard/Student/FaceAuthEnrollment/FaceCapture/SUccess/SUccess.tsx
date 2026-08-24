"use client";

import { AlertCircle, CheckCircle, Shield } from "lucide-react";
import { ISUccessProps } from "./interface";

export const SUccess = ({
  backupCodes,
  downloadBackupCodes,
  onEnrollmentComplete,
  copyBackupCodes,
  isVerification,
  successMessage,
  step,
}: ISUccessProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {step?.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {successMessage || step?.description}
        </p>
      </div>

      {backupCodes.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                Backup Codes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Save these codes in a secure location. Each code can be used
                once if face login fails.
              </p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {backupCodes.map((code) => (
              <div
                key={code.id}
                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-center font-mono font-bold tracking-wider"
              >
                {code.code}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={downloadBackupCodes}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Download Codes
            </button>
            <button
              onClick={copyBackupCodes}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 shrink-0" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                ⚠️ These codes will only be shown once. Save them securely now!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center pt-4">
        <button
          onClick={() =>
            onEnrollmentComplete?.({
              success: true,
              backupCodes: backupCodes.map((c) => c.code),
              message: successMessage || "Enrollment complete",
            })
          }
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          {isVerification ? "Continue to Exam" : "Continue to Dashboard"}
        </button>
      </div>
    </div>
  );
};
