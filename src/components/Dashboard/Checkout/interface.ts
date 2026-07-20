export interface ICheckoutPageProps {
  searchParams: Promise<{
    transaction_id?: string;
    tx_ref?: string;
    status?: string;
    reference?: string;
    merchandiseType: TMaterialType;
  }>;
}

export interface ICheckoutProps {
  provider: "FLUTTERWAVE" | "PAYSTACK";
  transactionRef: string;
  transactionId: string;
  merchandiseType: string;
  status?: string;
}

export interface IVerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    materialId: string;
  };
}

export type TMaterialType = "EXAM_REGISTRATION" | "COURSE_MATERIAL";
export type TProviderType = "FLUTTERWAVE" | "PAYSTACK";

export interface IUsePaymentVerificationProps {
  provider: string;
  transactionRef: string;
  transactionId: string;
  merchandiseType: TMaterialType;
}
