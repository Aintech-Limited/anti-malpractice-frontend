import { Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import { IExamsStatsProps } from "./interface";

export const ExamsStats = ({
  total,
  inProgress,
  registered,
  failed,
}: IExamsStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Registrations</p>
            <p className="text-2xl font-bold text-gray-800">{total}</p>
          </div>
          <FileText className="w-8 h-8 text-indigo-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Pending Payment</p>
            <p className="text-2xl font-bold text-yellow-600">{inProgress}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Registered</p>
            <p className="text-2xl font-bold text-green-600">{registered}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Payment Failed</p>
            <p className="text-2xl font-bold text-red-600">{failed}</p>
          </div>
          <XCircle className="w-8 h-8 text-red-100" />
        </div>
      </div>
    </div>
  );
};
