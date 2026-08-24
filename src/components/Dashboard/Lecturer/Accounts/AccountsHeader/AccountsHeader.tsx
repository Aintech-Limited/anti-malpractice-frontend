"use client";

import { AlertCircle, Key } from "lucide-react";
import { IAccountsHeaderProps } from "./interface";

export default function AccountsHeader({
  accountsCount,
  maxAccounts,
  hasPIN,
  onOpenChangePIN,
}: IAccountsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Bank Accounts
          </h1>
          <p className="text-gray-600 mt-2">Manage your linked bank accounts</p>
        </div>
        {hasPIN && (
          <button
            onClick={onOpenChangePIN}
            className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Key className="w-4 h-4" />
            Change PIN
          </button>
        )}
      </div>

      {/* Warning Banner */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        <p className="text-sm text-yellow-800">
          Maximum of {maxAccounts} accounts can be added. You have added{" "}
          {accountsCount}/{maxAccounts} accounts.
        </p>
      </div>
    </div>
  );
}
