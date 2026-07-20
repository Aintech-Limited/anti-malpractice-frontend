import { TSignupStage } from "../interface";

export interface ISignupFormProps {
  setStage: (stage: TSignupStage) => void;
}
export interface ISignupFormValues {
  email: string;
  fullName: string;
  acceptTerms: boolean;
  confirmPassword: string;
  password: string;
}
export interface ISignupFormErrors {
  email: string;
  fullName: string;
  acceptTerms: boolean;
  confirmPassword: string;
}
