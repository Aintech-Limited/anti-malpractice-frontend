"use client";

import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { IQuestionsListProps } from "./interface";

export default function QuestionsList({
  questions,
  onSelectQuestion,
  selectedQuestionId,
}: IQuestionsListProps) {
  // console.log('list questions: ', questions);
  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusIcon = (gradedCount: number, total: number) => {
    if (gradedCount === total) {
      return <CheckCircle size={16} className="text-green-600" />;
    }
    if (gradedCount > 0) {
      return <Clock size={16} className="text-yellow-600" />;
    }
    return <AlertCircle size={16} className="text-red-600" />;
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => {
        const isSelected = selectedQuestionId === question.id;
        const isFullyGraded =
          question.gradedCount === question.totalSubmissions;
        const progressColor = getProgressColor(question.progressPercentage);
        // console.log('question: ', question);

        return (
          <button
            key={question.id}
            onClick={() => !isFullyGraded && onSelectQuestion(question.id)}
            disabled={isFullyGraded}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              isSelected
                ? "border-indigo-500 bg-indigo-50 shadow-md"
                : isFullyGraded
                  ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                  : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-500">
                    Question {question.displayOrder}
                  </span>
                  {getStatusIcon(
                    question.gradedCount,
                    question.totalSubmissions,
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {question.questionText}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Max marks: {question.marks}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>
                  {question.gradedCount} / {question.totalSubmissions} graded
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${progressColor}`}
                  style={{ width: `${question.progressPercentage}%` }}
                />
              </div>
              {question.pendingCount > 0 && (
                <p className="text-xs text-yellow-600 mt-2">
                  {question.pendingCount} answers remaining to grade
                </p>
              )}
              {isFullyGraded && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle size={12} />
                  All answers graded
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
