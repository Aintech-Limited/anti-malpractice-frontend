import { Check, Clock, Radio } from "lucide-react";
import { IExam, IExamCardProps } from "./interface";

const ExamCard = ({
  type,
  title,
  startsIn,
  details,
  syllabus,
  badgeColor,
}: IExamCardProps & IExam) => {
  const isLive = type === "LIVE EXAM";

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10 group">
      <div className="flex justify-between items-center mb-6">
        <div
          className={`${badgeColor} text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isLive ? "animate-pulse-red" : ""}`}
        >
          {isLive ? <Radio size={14} /> : <Clock size={14} />}
          {type}
        </div>
        <div
          className={`${isLive ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"} px-3 py-1.5 rounded-lg text-xs font-bold`}
        >
          Starts in: {startsIn}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="space-y-2 bg-gray-50 p-3 rounded-xl">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex justify-between text-[11px]">
              <span className="text-gray-500 font-bold capitalize">{key}:</span>
              <span className="text-gray-900 font-bold">{value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 py-1">
          {syllabus.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-[11px] font-bold text-gray-800"
            >
              <Check size={14} className="text-blue-600" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <button className="mt-auto w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200">
        Exam Details
      </button>
    </div>
  );
};

export default ExamCard;
