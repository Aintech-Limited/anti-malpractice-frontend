import { PaymentCard } from "../PaymentCard/PaymentCard";
import { getMerchandiseIcon } from "../utils/paymentHelpers";
import { IPaymentsListProps } from "./interface";

export const PaymentsList = ({
  payments,
  onViewDetails,
}: IPaymentsListProps) => {
  if (payments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <p className="text-gray-500">No payments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment, idx) => {
        const Icon = getMerchandiseIcon(payment.merchandiseName);
        return (
          <PaymentCard
            key={payment.id ?? idx}
            payment={payment}
            onViewDetails={onViewDetails}
            ICON={Icon}
          />
        );
      })}
    </div>
  );
};
