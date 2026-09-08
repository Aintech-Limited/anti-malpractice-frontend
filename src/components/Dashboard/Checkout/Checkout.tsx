"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ICheckoutProps, TMaterialType } from "./interface";
import { usePaymentVerification } from "./hooks/usePaymentVerification";
import { useCountdown } from "./hooks/useCountdown";
import { getRedirectPath } from "./utils/paymentHelpers";
import { COUNTDOWN_DURATION } from "./utils/paymentConstants";
import { CheckoutContainer } from "./CheckoutContainer/CheckoutContainer";
import { InvalidState } from "./InvalidState/InvalidState";
import { VerifyingState } from "./VerifyingState/VerifyingState";
import { SuccessState } from "./SuccessState/SuccessState";
import { FailureState } from "./FailureState/FailureState";

export default function Checkout({
  provider,
  transactionRef,
  transactionId,
  merchandiseType,
  status,
}: ICheckoutProps) {
  const router = useRouter();
  const { verifying, success, error, materialId, verifyPayment } =
    usePaymentVerification({
      provider,
      transactionRef,
      transactionId,
      merchandiseType: merchandiseType as TMaterialType,
    });

  const handleRedirect = () => {
    if (materialId) {
      const path = getRedirectPath(
        merchandiseType as TMaterialType,
        materialId,
      );
      router.push(path);
    }
  };

  const { countdown } = useCountdown(COUNTDOWN_DURATION, handleRedirect);

  useEffect(() => {
    if (!transactionRef || !transactionId || !merchandiseType) return;
    verifyPayment();
  }, [transactionId, transactionRef, merchandiseType, verifyPayment]);

  const handleRetry = () => {
    router.push(encodeURI(window.location.href));
  };

  if (status === "invalid") {
    return (
      <CheckoutContainer>
        <InvalidState transactionRef={transactionRef} onRetry={handleRetry} />
      </CheckoutContainer>
    );
  }

  if (verifying) {
    return (
      <CheckoutContainer>
        <VerifyingState transactionRef={transactionRef} />
      </CheckoutContainer>
    );
  }

  if (success) {
    return (
      <CheckoutContainer>
        <SuccessState
          transactionRef={transactionRef}
          countdown={countdown}
          onContinue={handleRedirect}
          merchandiseType={merchandiseType as TMaterialType}
        />
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <FailureState error={error} onRetry={handleRetry} />
    </CheckoutContainer>
  );
}
