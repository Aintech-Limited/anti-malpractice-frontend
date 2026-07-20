import { IExamStatsCardProps } from "./interface";

const ExamStatsCard = ({
  approved,
  changesRequested,
  notApproved,
  published,
  total,
}: IExamStatsCardProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="text-2xl font-bold text-gray-800">{total}</div>
        <div className="text-sm text-gray-500">Total Exams</div>
      </div>
      <div className="bg-yellow-50 rounded-lg p-4 shadow-sm border border-yellow-100">
        <div className="text-2xl font-bold text-yellow-700">{notApproved}</div>
        <div className="text-sm text-yellow-600">Pending Approval</div>
      </div>
      <div className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-100">
        <div className="text-2xl font-bold text-green-700">{approved}</div>
        <div className="text-sm text-green-600">Approved</div>
      </div>
      <div className="bg-red-50 rounded-lg p-4 shadow-sm border border-red-100">
        <div className="text-2xl font-bold text-red-700">
          {changesRequested}
        </div>
        <div className="text-sm text-red-600">Changes Requested</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-100">
        <div className="text-2xl font-bold text-blue-700">{published}</div>
        <div className="text-sm text-blue-600">Published</div>
      </div>
    </div>
  );
};

export default ExamStatsCard;
