import { IPayment } from "../interface";

export interface IPaymentCardProps {
  payment: IPayment;
  onViewDetails: (payment: IPayment) => void;
}
