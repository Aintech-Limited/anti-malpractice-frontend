import { Mail, CheckCircle } from "lucide-react";
import { IEmailBannerProps } from "./interface";

export const EmailBanner = ({ email, isVerified }: IEmailBannerProps) => {
  return (
    <div className="bg-linear-to-r from-blue-500 to-purple-900 px-8 py-6">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6" />
          <div>
            <p className="text-sm opacity-90">Email Address</p>
            <p className="text-xl font-semibold">{email}</p>
          </div>
        </div>
        {isVerified && (
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Verified</span>
          </div>
        )}
      </div>
    </div>
  );
};
