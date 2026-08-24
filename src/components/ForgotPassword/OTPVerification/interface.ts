import { TForgotPasswordPhase } from "../interface";

export interface IOTPVerificationProps {
  setPhase: (phase: TForgotPasswordPhase) => void;
}
