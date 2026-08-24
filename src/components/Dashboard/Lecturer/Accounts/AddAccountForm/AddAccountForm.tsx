"use client";

import { Plus, RefreshCw, Send } from "lucide-react";
import { IAddAccountFormProps } from "./interface";
import PINInput from "../PINInput/PINInput";

export default function AddAccountForm({
  banks,
  accountsCount,
  maxAccounts,
  loading,
  verifyingAccount,
  formData,
  onFormChange,
  onVerifyAccount,
  onSubmit,
}: IAddAccountFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-600" />
        Add New Account
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank
          </label>
          <select
            value={formData.bankCode}
            onChange={(e) => {
              const selectedBank = banks.find(
                (bank) => bank.code === e.target.value,
              );
              onFormChange({
                bankCode: e.target.value,
                bankName: selectedBank?.name || "",
                accountName: "",
              });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select a bank</option>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.code}>
                {bank.name} ({bank.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => {
                onFormChange({
                  accountNumber: e.target.value,
                  accountName: "",
                });
              }}
              placeholder="Enter account number"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <button
              type="button"
              onClick={onVerifyAccount}
              disabled={
                verifyingAccount ||
                !formData.accountNumber ||
                !formData.bankCode
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {verifyingAccount ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Verify
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Name
          </label>
          <input
            type="text"
            value={formData.accountName}
            readOnly
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
            placeholder="Account name will appear here after verification"
          />
        </div>

        <PINInput
          value={formData.pin}
          onChange={(index, val) => {
            const newPin = [...formData.pin];
            newPin[index] = val;
            onFormChange({ pin: newPin });
          }}
          label="Security PIN"
          showToggle={true}
        />

        <button
          type="submit"
          disabled={
            loading || accountsCount >= maxAccounts || !formData.accountName
          }
          className="w-full py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          Add Account
        </button>

        {accountsCount >= maxAccounts && (
          <p className="text-center text-sm text-red-600">
            Maximum limit of {maxAccounts} accounts reached
          </p>
        )}
      </form>
    </div>
  );
}
