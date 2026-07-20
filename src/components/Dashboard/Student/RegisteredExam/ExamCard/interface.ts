import { IExamRegistration } from "../interface";

export interface IExamCardProps {
  exam: IExamRegistration;
  onContinuePayment: (exam: IExamRegistration) => void;
}
