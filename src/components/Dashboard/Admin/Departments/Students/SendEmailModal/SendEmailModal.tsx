"use client";

import { useState } from "react";
import { Mail, X } from "lucide-react";
import { ISendEmailModalProps } from "./interface";
import { emailTemplates } from "../constants/emailTemplates";
import { EmailTemplateEnum, TEmailTemplateEnum } from "@/src/lib/enums";

export default function SendEmailModal({
  isOpen,
  onClose,
  onConfirm,
  studentName,
  studentEmail,
}: ISendEmailModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TEmailTemplateEnum>(
    EmailTemplateEnum.BLOCK_NOTIFICATION,
  );
  const [customMessage, setCustomMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm(selectedTemplate, customMessage || undefined);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-md bg-black/50" />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Send Email to Student
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Sending email to: <strong>{studentName}</strong>
            </p>
            <p className="text-xs text-gray-500">{studentEmail}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) =>
                setSelectedTemplate(e.target.value as TEmailTemplateEnum)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {emailTemplates.map((template) => (
                <option key={template.value} value={template.value}>
                  {template.label} - {template.description}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
              placeholder="Add a personal message to include in the email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will be appended to the selected email template
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-800">
              ℹ️ The email will be sent using the selected template. The student
              will receive it at {studentEmail}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
