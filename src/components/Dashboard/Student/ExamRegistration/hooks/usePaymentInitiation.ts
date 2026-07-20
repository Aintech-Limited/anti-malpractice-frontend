"use client";

import { useState } from "react";

export const usePaymentInitiation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (
    examRegistrationId: string,
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/v1/purchase/initiate/exam-registrations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merchandiseId: examRegistrationId,
            merchandiseType: "EXAM_REGISTRATION",
            provider: "FLUTTERWAVE",
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        return data.data.link;
      } else {
        setError(data.message || "Failed to initiate payment");
        return null;
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    initiatePayment,
    loading,
    error,
    setError,
  };
};
