"use client";

import { TViolation } from "@/src/lib/proctoring/interface";
import { Activity, UserCheck } from "lucide-react";

const ExamStatusDashboard = ({ violations }: { violations: TViolation[] }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 hidden md:block">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <Activity className="w-3 h-3" /> System Health
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-gray-600">Camera</span>
          <span className="text-green-500 flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> Active
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-gray-600">Screen</span>
          <span className="text-green-500">Sharing</span>
        </div>
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-gray-600">Violations</span>
          <span
            className={`${violations.length > 0 ? "text-red-500" : "text-gray-400"}`}
          >
            {violations.length} Detected
          </span>
        </div>
        {/* violation warning if too many */}
        {violations.length > 5 && (
          <div className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded-lg">
            ⚠️ High violation count detected
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamStatusDashboard;
