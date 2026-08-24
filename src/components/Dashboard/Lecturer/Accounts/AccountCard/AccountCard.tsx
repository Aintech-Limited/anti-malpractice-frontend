"use client";

import { Building2, Trash2 } from "lucide-react";
import { IAccountCardProps } from "./interface";

export default function AccountCard({
  account,
  onDelete,
  onSetDefault,
}: IAccountCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {account.accountName}
            </h3>
            <p className="text-gray-600">{account.bankName}</p>
            <p className="text-gray-500 text-sm mt-1">
              Account: {account.accountNumber}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Added: {new Date(account.createdAt).toLocaleDateString()}
            </p>
            {account.isDefault && (
              <p className="text-xs text-green-900 mt-2 animate-soft-pulse">
                Default Account
              </p>
            )}
          </div>
        </div>
        {!account.isDefault && (
          <button
            onClick={() => onDelete(account)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        {!account.isDefault && (
          <button
            onClick={() => onSetDefault(account)}
            className="p-2 text-blue-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            set default
          </button>
        )}
      </div>
    </div>
  );
}
