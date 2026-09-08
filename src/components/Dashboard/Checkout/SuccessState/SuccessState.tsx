import { CheckCircle } from "lucide-react";
import { STATUS_MESSAGES } from "../utils/paymentConstants";
import { formatTransactionRef } from "../utils/paymentHelpers";
import { ISuccessStateProps } from "./interface";

export const SuccessState = ({
  transactionRef,
  countdown,
  onContinue,
  merchandiseType,
}: ISuccessStateProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {STATUS_MESSAGES.SUCCESS.title}
      </h2>
      <p className="text-gray-600 mb-6">
        {STATUS_MESSAGES.SUCCESS.description}
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 mb-1">Transaction Reference</p>
        <code className="text-sm font-mono text-gray-900 break-all">
          {formatTransactionRef(transactionRef)}
        </code>
      </div>

      <button
        onClick={onContinue}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Continue to {merchandiseType === "COURSE_MATERIAL" ? "Course" : "Exams"}{" "}
        ({countdown}s)
      </button>

      <p className="text-xs text-gray-500 mt-4">
        You&apos;ll be redirected automatically in {countdown} seconds
      </p>
    </div>
  );
};
