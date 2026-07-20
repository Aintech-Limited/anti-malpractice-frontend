"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, AlertCircle } from "lucide-react";
import { IUpdateQuestionPayload, TExamQuestionType } from "../interface";
import { IEditQuestionModalProps } from "./interface";

const QUESTION_TYPES: { value: TExamQuestionType; label: string }[] = [
  { value: "MCQ", label: "Multiple Choice" },
  { value: "TRUE_FALSE", label: "True/False" },
  { value: "FILL_BLANK", label: "Fill in the Blank" },
  { value: "SHORT", label: "Short Answer" },
  { value: "ESSAY", label: "Essay" },
];

export const EditQuestionModal = ({
  question,
  examId,
  onClose,
  onSuccess,
}: IEditQuestionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<IUpdateQuestionPayload>({
    questionText: question.questionText,
    type: question.type,
    marks: question.marks,
    options:
      question.options?.map((opt) => ({
        id: opt.id,
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
        displayOrder: opt.displayOrder,
      })) || [],
  });

  const handleAddOption = () => {
    const newOrder = (formData.options?.length || 0) + 1;
    setFormData({
      ...formData,
      options: [
        ...(formData.options || []),
        { optionText: "", isCorrect: false, displayOrder: newOrder },
      ],
    });
  };

  const handleUpdateOption = (index: number, field: string, value: any) => {
    const updatedOptions = [...(formData.options || [])];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = (formData.options || []).filter(
      (_, i) => i !== index,
    );
    // Reorder remaining options
    updatedOptions.forEach((opt, idx) => {
      opt.displayOrder = idx + 1;
    });
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate MCQ options
    if (formData.type === "MCQ" && formData.options) {
      const hasCorrect = formData.options.some((opt) => opt.isCorrect);
      if (!hasCorrect) {
        setError("Please select at least one correct answer");
        setLoading(false);
        return;
      }
      const hasEmpty = formData.options.some((opt) => !opt.optionText.trim());
      if (hasEmpty) {
        setError("Please fill in all options");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`/api/v1/exams/questions/${question.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || "Failed to update question");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isMCQ = formData.type === "MCQ";
  const isTrueFalse = formData.type === "TRUE_FALSE";

  // Auto-set options for True/False
  useEffect(() => {
    if (isTrueFalse && (!formData.options || formData.options.length === 0)) {
      setFormData({
        ...formData,
        options: [
          { optionText: "True", isCorrect: false, displayOrder: 1 },
          { optionText: "False", isCorrect: false, displayOrder: 2 },
        ],
      });
    }
  }, [formData, formData.type, isTrueFalse]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 animate-fadeIn p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Edit Question</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text *
            </label>
            <textarea
              value={formData.questionText}
              onChange={(e) =>
                setFormData({ ...formData, questionText: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your question here..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as TExamQuestionType,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {QUESTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Marks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marks *
              </label>
              <input
                type="number"
                min="1"
                value={formData.marks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    marks: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Options for MCQ */}
          {(isMCQ || isTrueFalse) && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Options *
                </label>
                {isMCQ && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Option
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {formData.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={option.isCorrect}
                      onChange={() => {
                        const updatedOptions = [...(formData.options || [])];
                        updatedOptions.forEach((opt, idx) => {
                          opt.isCorrect = idx === index;
                        });
                        setFormData({ ...formData, options: updatedOptions });
                      }}
                      className="w-4 h-4 text-green-600"
                    />
                    <input
                      type="text"
                      value={option.optionText}
                      onChange={(e) =>
                        handleUpdateOption(index, "optionText", e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      disabled={isTrueFalse}
                    />
                    {isMCQ &&
                      formData.options &&
                      formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                ))}
              </div>
              {isMCQ && (
                <p className="text-xs text-gray-500 mt-2">
                  Select the radio button next to the correct answer
                </p>
              )}
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
