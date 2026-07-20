import { Lock } from "lucide-react";
import { IPasswordSectionProps } from "./interface";

export const PasswordSection = ({
  hasPassword,
  onOpenModal,
}: IPasswordSectionProps) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-semibold text-gray-800">Password</h3>
            <p className="text-sm text-gray-500">
              {hasPassword
                ? "You have a password set for your account"
                : "No password set (Google signup). Add a password for email login."}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenModal}
          className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          {hasPassword ? "Change Password" : "Add Password"}
        </button>
      </div>
    </div>
  );
};
