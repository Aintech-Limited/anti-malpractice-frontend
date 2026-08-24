"use client";

import { useState } from "react";
import { X, CreditCard, AlertCircle, ExternalLink, Loader } from "lucide-react";
import { IPaymentModalProps } from "./interface";
import { initiatePayment } from "../utils/examHelpers";

export const PaymentModal = ({
  exam,
  onClose,
  onSuccess,
}: IPaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState<string | null>(null);

  const handleInitiatePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await initiatePayment(exam.id, "FLUTTERWAVE");

      if (response.success) {
        setPaymentLink(response.data.link);
        setTransactionRef(response.data.transactionRef);
        window.open(response.data.link, "_blank");
        onSuccess();
      } else {
        setError(response.message || "Failed to initiate payment");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (paymentLink) {
      window.open(paymentLink, "_blank");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Complete Payment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Exam Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Exam:</span> {exam.exam.title}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Course:</span>{" "}
              {exam.course.courseCode}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Level:</span> {exam.level} |
              Semester: {exam.semester}
            </p>
            {exam.exam.fee && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Amount:</span>{" "}
                <span className="text-lg font-bold text-indigo-600">
                  ₦{exam.exam.fee.toLocaleString()}
                </span>
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {paymentLink ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm mb-2">
                  Payment link generated successfully! Your transaction
                  reference is:
                </p>
                <p className="text-xs font-mono text-green-600 bg-green-100 p-2 rounded">
                  {transactionRef}
                </p>
              </div>
              <button
                onClick={handleContinue}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Continue to Payment Page
              </button>
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    You will be redirected to our secure payment gateway to
                    complete your transaction.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInitiatePayment}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                  Proceed to Payment
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
