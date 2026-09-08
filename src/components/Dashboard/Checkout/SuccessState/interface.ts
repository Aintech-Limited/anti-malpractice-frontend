import { TMaterialType } from "../interface";

export interface ISuccessStateProps {
  transactionRef: string;
  countdown: number;
  onContinue: () => void;
  merchandiseType?: TMaterialType;
}
