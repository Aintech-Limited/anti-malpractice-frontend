"use client";

import { Download } from "lucide-react";
import { exportToCSV } from "../utils/registrationHelpers";
import { IExportButtonProps } from "./interface";

export const ExportButton = ({
  registrations,
  examTitle,
}: IExportButtonProps) => {
  const handleExport = () => {
    exportToCSV(registrations, examTitle);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
    >
      <Download className="w-5 h-5" />
      Export to CSV
    </button>
  );
};
