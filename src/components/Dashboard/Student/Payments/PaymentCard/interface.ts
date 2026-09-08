import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IPayment } from "../interface";
import { LucideProps } from "lucide-react";

export interface IPaymentCardProps {
  payment: IPayment;
  onViewDetails: (payment: IPayment) => void;
  ICON: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}
