import { EnrollmentStep } from '../interface';

export interface IInstructionsProps {
	step: EnrollmentStep | undefined;
	startFaceCapture: () => void;
	onCancel: (() => void) | undefined;
}
