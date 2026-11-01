import { Mail, CheckCircle } from "lucide-react";
import { IEmailBannerProps } from "./interface";

export const EmailBanner = ({ email, isVerified }: IEmailBannerProps) => {
  return (
    <div className="bg-linear-to-r from-blue-500 to-purple-900 px-4 sm:px-8 py-6 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white w-full min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Mail className="w-6 h-6 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm opacity-90">Email Address</p>
            <p className="text-base sm:text-xl font-semibold break-all">
              {email}
            </p>
          </div>
        </div>
        {isVerified && (
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full self-start sm:self-auto shrink-0">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs sm:text-sm whitespace-nowrap">
              Verified
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
