import { CheckCircle, Clock, Lock } from "lucide-react";
import { IStatusBadgeProps } from "./interface";

export const StatusBadge = ({ status }: IStatusBadgeProps) => {
  switch (status) {
    case "registered":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Registered
        </span>
      );
    case "active":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    case "locked":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          <Lock className="w-3 h-3 mr-1" />
          Locked
        </span>
      );
    default:
      return null;
  }
};
