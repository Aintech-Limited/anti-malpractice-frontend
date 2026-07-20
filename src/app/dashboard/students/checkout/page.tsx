import { Suspense } from "react";
import CheckoutLoading from "@/src/components/Dashboard/Checkout/CheckoutLoading/CheckoutLoading";
import { ICheckoutPageProps } from "@/src/components/Dashboard/Checkout/interface";
import Checkout from "@/src/components/Dashboard/Checkout/Checkout";

const CheckoutPage = async ({ searchParams }: ICheckoutPageProps) => {
  const { transaction_id, tx_ref, status, reference, merchandiseType } =
    await searchParams;

  const provider = transaction_id ? "FLUTTERWAVE" : "PAYSTACK";
  const transactionRef = tx_ref ?? reference ?? "";
  const transactionId = transaction_id ?? reference ?? "";

  return (
    <Suspense fallback={<CheckoutLoading />}>
      <Checkout
        provider={provider}
        transactionRef={transactionRef}
        transactionId={transactionId}
        status={!transactionId || !transactionRef ? "invalid" : status}
        merchandiseType={merchandiseType}
      />
    </Suspense>
  );
};

export default CheckoutPage;
