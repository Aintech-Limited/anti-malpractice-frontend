import { IPayment } from "../interface";

export interface IPaymentsListProps {
  payments: IPayment[];
  onViewDetails: (payment: IPayment) => void;
}
