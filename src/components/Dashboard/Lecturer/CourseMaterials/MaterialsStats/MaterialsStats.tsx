import { FileText, Download, DollarSign, Star } from "lucide-react";
import { IMaterialsStatsProps } from "./interface";

export const MaterialsStats = ({
  totalMaterials,
  totalDownloads,
  totalRevenue,
  averageRating,
}: IMaterialsStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Materials</p>
            <p className="text-2xl font-bold text-gray-800">{totalMaterials}</p>
          </div>
          <FileText className="w-8 h-8 text-indigo-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Downloads</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalDownloads.toLocaleString()}
            </p>
          </div>
          <Download className="w-8 h-8 text-blue-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ₦{totalRevenue.toLocaleString()}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-green-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Average Rating</p>
            <p className="text-2xl font-bold text-yellow-600">
              {averageRating.toFixed(1)}
            </p>
          </div>
          <Star className="w-8 h-8 text-yellow-100" />
        </div>
      </div>
    </div>
  );
};
