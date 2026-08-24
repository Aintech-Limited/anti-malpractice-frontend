import { ClipboardList } from "lucide-react";
import { IExamsHeaderProps } from "./interface";

export const ExamsHeader = ({ totalExams }: IExamsHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <ClipboardList className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          My Exam Registrations
        </h1>
      </div>
      <p className="text-gray-600">
        View and manage your exam registrations • {totalExams} registration
        {totalExams !== 1 ? "s" : ""} total
      </p>
    </div>
  );
};
