import { CreditCard, TrendingUp, Package } from "lucide-react";
import { IStatsCardProps } from "../interface";

export const StatsCards = ({
  totalTransactions,
  totalAmount,
  currentPage,
  totalPages,
}: IStatsCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Transactions</p>
            <p className="text-3xl font-bold text-gray-800">
              {totalTransactions}
            </p>
          </div>
          <CreditCard className="w-12 h-12 text-indigo-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Amount</p>
            <p className="text-3xl font-bold text-gray-800">
              ₦{totalAmount.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="w-12 h-12 text-green-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Pages</p>
            <p className="text-3xl font-bold text-gray-800">
              {currentPage} / {totalPages}
            </p>
          </div>
          <Package className="w-12 h-12 text-purple-100" />
        </div>
      </div>
    </div>
  );
};
