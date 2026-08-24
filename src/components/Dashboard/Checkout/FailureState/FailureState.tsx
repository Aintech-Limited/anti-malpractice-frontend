import { XCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { STATUS_MESSAGES } from "../utils/paymentConstants";
import { IFailureStateProps } from "./interface";

export const FailureState = ({ error, onRetry }: IFailureStateProps) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-12 h-12 text-red-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {STATUS_MESSAGES.FAILURE.title}
      </h2>
      <p className="text-gray-600 mb-6">
        {error ||
          "Unable to verify your payment. Please try again or contact support."}
      </p>

      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push("/support")}
          className="w-full px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
        >
          Contact Support
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => router.push("/dashboard/students/courses/registered")}
          className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Courses
        </button>
      </div>
    </div>
  );
};
