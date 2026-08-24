import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Shield,
} from "lucide-react";
import { ExamSummaryProps } from "./interface";
import { ExamQuestionTypeEnum } from "@/src/lib/enums";

export const ExamSummary = ({
  questions,
  answers,
  violations,
  timeSpent,
  onClose,
}: ExamSummaryProps) => {
  const violationSummary = violations.reduce(
    (acc, violation) => {
      acc[violation.type] = (acc[violation.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Exam Submitted Successfully
        </h1>
        <p className="text-gray-500 mt-2">
          Your responses have been recorded and sent for grading.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
          <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-900">
            {Object.keys(answers).length} / {questions.length}
          </p>
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">
            Answered
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center">
          <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-900">{timeSpent}</p>
          <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">
            Time Taken
          </p>
        </div>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-center">
          <Shield className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-amber-900">
            {violations.length}
          </p>
          <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">
            Violations Logged
          </p>
        </div>
      </div>

      {/* Proctoring Report Section */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Proctoring Report
        </h3>
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          {violations.length > 0 ? (
            <div className="space-y-3">
              {Object.entries(violationSummary).map(([type, count]) => (
                <div
                  key={type}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {type.replaceAll("_", " ")}
                  </span>
                  <span className="bg-white border border-gray-300 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                    {count} Times
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No violations were recorded during this session.
            </p>
          )}
        </div>
      </div>

      {/* Review Brief */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Response Snapshot</h3>
        {questions.map((q) => (
          <div
            key={q.id}
            className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
          >
            <p className="text-sm font-bold text-gray-400 mb-1">
              Question {q.id}
            </p>
            <p className="text-sm font-medium text-gray-800 line-clamp-1">
              {q.questionText}
            </p>
            <p className="text-xs mt-2 text-blue-600 italic">
              Submitted:{" "}
              {answers[q.id]?.optionId
                ? q.type === ExamQuestionTypeEnum.MCQ
                  ? !answers[q.id].optionId
                  : "Written Response Provided"
                : "No Answer"}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="w-full mt-12 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-colors"
      >
        Return to Dashboard
      </button>
    </div>
  );
};
