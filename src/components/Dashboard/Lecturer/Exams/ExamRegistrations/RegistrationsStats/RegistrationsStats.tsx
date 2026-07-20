import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { IRegistrationsStatsProps } from "./interface";

export const RegistrationsStats = ({
  total,
  registered,
  inProgress,
  cancelled,
}: IRegistrationsStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Registrations</p>
            <p className="text-2xl font-bold text-gray-800">{total}</p>
          </div>
          <Users className="w-8 h-8 text-indigo-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Registered</p>
            <p className="text-2xl font-bold text-green-600">{registered}</p>
          </div>
          <UserCheck className="w-8 h-8 text-green-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{inProgress}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Cancelled/Failed</p>
            <p className="text-2xl font-bold text-red-600">{cancelled}</p>
          </div>
          <UserX className="w-8 h-8 text-red-100" />
        </div>
      </div>
    </div>
  );
};
