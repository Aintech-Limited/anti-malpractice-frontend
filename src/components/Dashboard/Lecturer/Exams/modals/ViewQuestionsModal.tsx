"use client";

import { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import { IViewQuestionsModalProps } from "./interface";
import { EditQuestionModal } from "./EditQuestionModal";
import { DeleteQuestionModal } from "./DeleteQuestionModal";
import { IExamQuestion } from "../interface";
import { getTypeBadgeColor } from "../utils/examHelpers";

export const ViewQuestionsModal = ({
  exam,
  onClose,
  onQuestionUpdated,
  onAddQuestion,
}: IViewQuestionsModalProps) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<IExamQuestion[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [error, setError] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<IExamQuestion | null>(
    null,
  );
  const [deletingQuestion, setDeletingQuestion] =
    useState<IExamQuestion | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/exams/questions/${exam.id}?page=1&limit=100&sortBy=createdAt&sortOrder=ASC`,
        {
          method: "GET",
          cache: "no-cache",
          credentials: "include",
        },
      );
      const data = await response.json();

      if (data.success) {
        setQuestions(data.data);
        // console.log('data: ', data);
      } else {
        setError(data.message || "Failed to fetch questions");
        console.error(data.message || "Failed to fetch questions");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [exam.id]);

  const toggleExpand = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleQuestionUpdated = () => {
    fetchQuestions();
    setEditingQuestion(null);
    onQuestionUpdated?.();
  };

  const handleQuestionDeleted = () => {
    fetchQuestions();
    setDeletingQuestion(null);
    onQuestionUpdated?.();
  };

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Exam Questions
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {exam.title} - {questions.length} questions • {totalMarks}{" "}
                    total marks
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onAddQuestion(exam)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchQuestions}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Retry
                </button>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No questions added yet.</p>
                <button
                  onClick={() => onAddQuestion(exam)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Your First Question
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Question Header */}
                    <div
                      className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleExpand(question.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="font-medium text-gray-700">
                              Q{index + 1}.
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(question.type)}`}
                            >
                              {question.type === "TRUE_FALSE"
                                ? "True/False"
                                : question.type === "FILL_BLANK"
                                  ? "Fill Blank"
                                  : question.type === "SHORT"
                                    ? "Short Answer"
                                    : question.type === "ESSAY"
                                      ? "Essay"
                                      : question.type}
                            </span>
                            <span className="text-sm text-gray-500">
                              {question.marks}{" "}
                              {question.marks === 1 ? "mark" : "marks"}
                            </span>
                            <span className="text-xs text-gray-400">
                              Order: {question.displayOrder}
                            </span>
                          </div>
                          <p className="text-gray-800">
                            {question.questionText}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingQuestion(question);
                            }}
                            className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                            title="Edit Question"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingQuestion(question);
                            }}
                            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete Question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {expandedQuestions.has(question.id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Question Details */}
                    {expandedQuestions.has(question.id) && (
                      <div className="p-4 border-t border-gray-200 bg-white">
                        {(question.type === "MCQ" ||
                          question.type === "TRUE_FALSE") &&
                          question.options &&
                          question.options.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Options:
                              </p>
                              {question.options
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((option, optIndex) => (
                                  <div
                                    key={option.id}
                                    className="flex items-center gap-2 ml-4"
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full ${option.isCorrect ? "bg-green-500" : "bg-gray-300"}`}
                                    />
                                    <span className="text-sm text-gray-600">
                                      {String.fromCharCode(65 + optIndex)}.{" "}
                                      {option.optionText}
                                    </span>
                                    {option.isCorrect && (
                                      <span className="text-xs text-green-600 ml-2">
                                        (Correct Answer)
                                      </span>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}

                        {question.type === "FILL_BLANK" && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">
                                Fill in the blank question:
                              </span>{" "}
                              Students will need to provide the missing
                              word/phrase.
                            </p>
                          </div>
                        )}

                        {(question.type === "SHORT" ||
                          question.type === "ESSAY") && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">
                                {question.type === "SHORT"
                                  ? "Short Answer"
                                  : "Essay"}{" "}
                                Question:
                              </span>{" "}
                              Students will provide a written response.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Summary Footer */}
            {!loading && questions.length > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Questions</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {questions.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Marks</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {totalMarks}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          examId={exam.id}
          onClose={() => setEditingQuestion(null)}
          onSuccess={handleQuestionUpdated}
        />
      )}

      {/* Delete Question Modal */}
      {deletingQuestion && (
        <DeleteQuestionModal
          question={deletingQuestion}
          onClose={() => setDeletingQuestion(null)}
          onSuccess={handleQuestionDeleted}
        />
      )}
    </>
  );
};
