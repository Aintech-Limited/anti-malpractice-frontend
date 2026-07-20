import { ExamQuestionTypeEnum } from "@/src/lib/enums";
import { IQuestionCardProps } from "./interface";
import { memo } from "react";

const QuestionCard = memo(
  ({
    question,
    onMCQInputChange,
    onSHORTInputChange,
    answers,
  }: IQuestionCardProps) => {
    console.log("question from card: ", question);
    return (
      <div
        key={question.id}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5"
      >
        <div className="bg-[#EBEFFF] px-6 py-2 inline-block rounded-br-2xl">
          <span className="text-sm font-bold text-blue-800">
            Question {question.type}: {question?.marks ?? "N/A"} marks
          </span>
        </div>

        <div className="p-8">
          <p className="text-lg font-semibold text-gray-800 mb-8">
            {question.questionText}
          </p>

          {question.type === ExamQuestionTypeEnum.MCQ ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options?.map((option, index) => {
                const label = String.fromCharCode(65 + index);
                const isSelected = answers[question.id]?.optionId === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => onMCQInputChange(question.id, option)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full border font-bold text-sm ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                    <span
                      className={`font-medium ${isSelected ? "text-blue-900" : "text-gray-700"}`}
                    >
                      {option.optionText}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : question.type === ExamQuestionTypeEnum.SHORT ? (
            <textarea
              rows={4}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-400 outline-none transition-all resize-none"
              placeholder="Type your explanation here..."
              value={answers[question.id]?.answerText || ""}
              onChange={(e) => onSHORTInputChange(question.id, e.target.value)}
            />
          ) : null}
        </div>
      </div>
    );
  },
);

QuestionCard.displayName = "QuestionCard";

export default QuestionCard;
