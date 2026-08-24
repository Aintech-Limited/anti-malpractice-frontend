import { EnrollmentStep } from "../interface";

export interface IErrorProps {
  step?: EnrollmentStep;
  error: string | null;
  retryCapture: () => void;
  onCancel: (() => void) | undefined;
}
