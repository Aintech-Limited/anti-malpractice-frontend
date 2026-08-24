import { ReactNode } from "react";

const ActionCard = ({ label, icon }: { label: string; icon: ReactNode }) => (
  <div className="bg-[#E2E8F0] p-6 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-200 hover:border-blue-400 transition-all text-gray-600 hover:text-blue-600">
    <div className="p-1 bg-white rounded-full shadow-sm">{icon}</div>
    <span className="text-xs font-bold">{label}</span>
  </div>
);

export default ActionCard;
